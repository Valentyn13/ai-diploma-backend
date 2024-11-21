const {HumanMessage, SystemMessage} = require('@langchain/core/messages');
const {sdkAnthropicModel, langchainAnthropicModel} = require('./models');

const {
  convertHistorySdkMessage,
  convertHistoryMessagesToAiStyle,
  generateSystemPrompt,
  convertHistoryMessagesToText,
} = require('./helpers');

const createApiCall = async (
  userData,
  historyMessages,
  lastCachedMessageIndex,
  startCacheMessageIndex,
  input,
  chatType,
) => {
  let newLastCachedIndex = lastCachedMessageIndex;
  let newStartCacheIndex = startCacheMessageIndex;

  const sysprompt = generateSystemPrompt(userData, chatType);

  const calculatedIndex = startCacheMessageIndex !== 0 ? startCacheMessageIndex + 1 : 0;

  const {cached, uncached} = historyMessages.slice(calculatedIndex).reduce(
    (acc, curr, i) => {
      if (lastCachedMessageIndex === 0) {
        if (curr.role === 'user') {
          acc.cached.push(curr);
        }
        return acc;
      }
      if (startCacheMessageIndex === 0) {
        if (curr.role === 'user') {
          if (i <= lastCachedMessageIndex) {
            acc.cached.push(curr);
          } else {
            acc.uncached.push(curr);
          }
        }
        return acc;
      }

      if (startCacheMessageIndex !== 0) {
        if (curr.role === 'user') {
          if (i < lastCachedMessageIndex - startCacheMessageIndex) {
            acc.cached.push(curr);
          } else {
            acc.uncached.push(curr);
          }
        }
      }

      return acc;
    },
    {
      cached: [],
      uncached: [],
    },
  );

  const cacheData = convertHistoryMessagesToText(cached);

  const uncachedData = convertHistoryMessagesToAiStyle(uncached);

  const messages = [
    new SystemMessage({
      content: [
        {
          type: 'text',
          text: sysprompt + cacheData,
          cache_control: {type: 'ephemeral'},
        },
      ],
    }),
    ...uncachedData,
    new HumanMessage({content: input}),
  ];

  const response = await langchainAnthropicModel.invoke(messages);

  if (response.response_metadata.usage.cache_creation_input_tokens && lastCachedMessageIndex === 0) {
    newLastCachedIndex = historyMessages.length - 1;
  } else if (response.response_metadata.usage.input_tokens > 800 && lastCachedMessageIndex !== 0) {
    newLastCachedIndex = historyMessages.length - 1;
    newStartCacheIndex = lastCachedMessageIndex;
  }

  return {aiMessage: response.content, newLastCachedIndex, newStartCacheIndex};
};

const createSdkApiCall = async (
  userData,
  historyMessages,
  lastCachedMessageIndex,
  startCacheMessageIndex,
  input,
  chatType,
  res,
) => {
  let newLastCachedIndex = lastCachedMessageIndex;
  let newStartCacheIndex = startCacheMessageIndex;

  // Generate sysprompt
  const sysprompt = generateSystemPrompt(userData, chatType);

  const calculatedIndex = startCacheMessageIndex !== 0 ? startCacheMessageIndex + 1 : 0;

  const {cached, uncached} = historyMessages.slice(calculatedIndex).reduce(
    (acc, curr, i) => {
      if (lastCachedMessageIndex === 0) {
        if (curr.role === 'user') {
          acc.cached.push(curr);
        }
        return acc;
      }
      if (startCacheMessageIndex === 0) {
        if (curr.role === 'user') {
          if (i <= lastCachedMessageIndex) {
            acc.cached.push(curr);
          } else {
            acc.uncached.push(curr);
          }
        }
        return acc;
      }

      if (startCacheMessageIndex !== 0) {
        if (curr.role === 'user') {
          if (i < lastCachedMessageIndex - startCacheMessageIndex) {
            acc.cached.push(curr);
          } else {
            acc.uncached.push(curr);
          }
        }
      }

      return acc;
    },
    {
      cached: [],
      uncached: [],
    },
  );

  const cacheData = convertHistoryMessagesToText(cached);

  const uncachedData = convertHistorySdkMessage(uncached);

  const stream = await sdkAnthropicModel.beta.promptCaching.messages.stream({
    model: process.env.ANTHROPIC_MODEL,
    max_tokens: 2048,
    system: [
      {
        type: 'text',
        text: sysprompt + cacheData,
        cache_control: {type: 'ephemeral'},
      },
    ],
    messages: [...uncachedData, {role: 'user', content: input}],
    stream: true,
  });

  let numTokensReceived = 0;
  let savedData = '';

  // eslint-disable-next-line no-restricted-syntax
  for await (const messageStreamEvent of stream) {
    if (messageStreamEvent.type === 'content_block_delta') {
      ++numTokensReceived;
      savedData += messageStreamEvent.delta.text;

      if (numTokensReceived >= 4) {
        res.write(savedData);
        numTokensReceived = 0;
        savedData = '';
      }
    }
    if (messageStreamEvent.type === 'content_block_stop') {
      res.write(savedData);
    }
  }
  const response = stream.receivedMessages[0];

  const aiMessage = response.content[0].text;

  if (response.usage.cache_creation_input_tokens && lastCachedMessageIndex === 0) {
    newLastCachedIndex = historyMessages.length - 1;
  } else if (response.usage.input_tokens > 800 && lastCachedMessageIndex !== 0) {
    newLastCachedIndex = historyMessages.length - 1;
    newStartCacheIndex = lastCachedMessageIndex;
  }

  return {aiMessage, newLastCachedIndex, newStartCacheIndex};
};

module.exports = {
  createApiCall,
  createSdkApiCall,
};
