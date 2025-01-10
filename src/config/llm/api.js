/* eslint-disable no-restricted-syntax */
/* eslint-disable no-case-declarations */
const {HumanMessage, SystemMessage} = require('@langchain/core/messages');
const {sdkAnthropicModel, langchainAnthropicModel} = require('./models');
const {SUMMARIZE_PROMPT, TRANSCRIPT_PROMPT, PROMPT_LIMITATION_PROMPT} = require('./prompts');
const {
  convertHistorySdkMessage,
  convertHistoryMessagesToAiStyle,
  generateSystemPrompt,
  convertHistoryMessagesToText,
} = require('./helpers');

const UserInsight = require('../../api/models/userInsight.model');
const SharedCategoryBatch = require('../../api/models/sharedCategoryBatches');

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
  personalSummary,
  categoriesSummary,
  res,
) => {
  let newLastCachedIndex = lastCachedMessageIndex;
  let newStartCacheIndex = startCacheMessageIndex;
  const sharedCategoryContext = categoriesSummary[chatType] || '';

  const sysprompt = generateSystemPrompt(userData, chatType);

  let combinedSystemPrompt = `${sysprompt}\n\n${personalSummary}\n\n${sharedCategoryContext}`;

  const calculatedIndex = startCacheMessageIndex !== 0 ? startCacheMessageIndex + 1 : 0;

  const {cached, uncached} = historyMessages.slice(calculatedIndex).reduce(
    (acc, curr, i) => {
      if (lastCachedMessageIndex === 0) {
        acc.cached.push(curr);
        return acc;
      }
      if (startCacheMessageIndex === 0) {
        if (i <= lastCachedMessageIndex) {
          acc.cached.push(curr);
        } else {
          acc.uncached.push(curr);
        }
        return acc;
      }

      if (startCacheMessageIndex !== 0) {
        if (i < lastCachedMessageIndex - startCacheMessageIndex) {
          acc.cached.push(curr);
        } else {
          acc.uncached.push(curr);
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
        text: `${combinedSystemPrompt}\n\n${cacheData}\n\n${PROMPT_LIMITATION_PROMPT}`,
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
  } else if (response.usage.input_tokens > 1200 && lastCachedMessageIndex !== 0) {
    newLastCachedIndex = historyMessages.length - 1;
    newStartCacheIndex = lastCachedMessageIndex;
  }

  return {aiMessage, newLastCachedIndex, newStartCacheIndex};
};

const createSummarization = async (messages) => {
  let questions = '';
  let answers = 'answers by the user:\n';

  messages.forEach(({question, answer}, i) => {
    const index = i + 1;
    answers += `${index}. ${answer}\n`;
    questions += `${index}. ${question}\n`;
  });

  const input = `${SUMMARIZE_PROMPT + questions}\n${answers}`;

  const response = await sdkAnthropicModel.messages.create({
    model: process.env.CHEAPEST_ANTHROPIC_MODEL,
    max_tokens: 600,
    temperature: 0.2,
    messages: [{role: 'user', content: input}],
  });

  return response.content[0].text;
};

const createSdkBatch = async (data) => {
  const batchQueries = data.map(({messages, uuid}) => {
    let userMessagesInTextFormat = 'User phrases:\n';
    messages.forEach((message) => {
      userMessagesInTextFormat += `${message.content}\n`;
    });
    const input = `${TRANSCRIPT_PROMPT}\n${userMessagesInTextFormat} \nPatient Summary:`;
    return {
      custom_id: uuid,
      params: {
        model: process.env.CHEAPEST_ANTHROPIC_MODEL,
        max_tokens: 400,
        messages: [{role: 'user', content: input}],
      },
    };
  });

  const messageBatch = await sdkAnthropicModel.beta.messages.batches.create({
    requests: batchQueries,
  });

  return messageBatch;
};

const retrieveBatchData = async (batchId) => {
  const messageBatch = await sdkAnthropicModel.beta.messages.batches.retrieve(batchId);

  return messageBatch;
};

const getBatchResults = async (batchId) => {
  for await (const result of await sdkAnthropicModel.beta.messages.batches.results(batchId)) {
    const resultType = result.result.type;
    switch (resultType) {
      case 'succeeded':
        const [userId, category] = result.custom_id.split('-');

        const summaryText = result.result.message.content[0].text;

        const newSummary = {
          [category]: summaryText,
        };

        const userInsight = await UserInsight.findOne({userId});

        if (userInsight) {
          // If chatContextUserInsight exists, update the summary
          if (userInsight.chatContextUserInsight) {
            const updatedSummary = {
              ...userInsight.chatContextUserInsight.summary,
              ...newSummary,
            };
            userInsight.chatContextUserInsight.summary = updatedSummary;
            await userInsight.save();
          } else {
            // If chatContextUserInsight doesn't exist, create it
            userInsight.chatContextUserInsight = {summary: newSummary};
            await userInsight.save();
          }
        } else {
          // If userInsight doesn't exist, create a new document
          await UserInsight.create({
            userId,
            chatContextUserInsight: {summary: newSummary},
          });
        }
        break;
      default:
        await SharedCategoryBatch.updateOne(
          {batchId},
          {
            $set: {hasErrorsInSubRequests: true},
            $push: {failedRequestsIds: custom_id},
          },
        );
        break;
    }
  }
};

const checkAndRetrieveBatchData = async (batches) => {
  const promises = batches.map(async (batch) => {
    const result = await retrieveBatchData(batch.batchId);
    const currentTime = Date.now();

    const update = {batchId: batch.batchId, status_check_time: currentTime};

    if (result.processing_status === 'ended') {
      await getBatchResults(batch.batchId);
      return {
        ...update,
        processing_status: 'ended',
      };
    }
    return update;
  });

  // Execute all updates in parallel
  const updates = await Promise.all(promises);

  // Bulk update after processing all batches
  if (updates.length > 0) {
    await SharedCategoryBatch.bulkWrite(
      updates.map((update) => ({
        updateOne: {
          filter: {batchId: update.batchId},
          update: {$set: update},
        },
      })),
    );
  }
};

module.exports = {
  createApiCall,
  createSdkApiCall,
  createSummarization,
  createSdkBatch,
  checkAndRetrieveBatchData,
  retrieveBatchData,
  getBatchResults,
};
