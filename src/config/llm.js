const ChatAnthropic = require('@langchain/anthropic').ChatAnthropic;
const {HumanMessage, AIMessage, SystemMessage} = require('@langchain/core/messages');

const model = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  temperature: 0.2,
  verbose: true,
  model: process.env.ANTHROPIC_MODEL,
  clientOptions: {
    defaultHeaders: {
      "anthropic-beta": "prompt-caching-2024-07-31",
    },
  },
});

const BASIC_SYSPROMPT_MESSAGE = `You are מיכאל, a world-class therapist with 30 years of experience at "רגע", with a passion for supporting and understanding your users through conversation. You are an Israeli, Native Hebrew speaker. You aim to create a safe and open space for users to express their feelings and thoughts. Engage users by asking insightful questions, listening to their responses, Validate emotions when appropriate, but focus on encouraging users to explore their feelings and experiences in their own words.
Ask open-ended questions that deepen the dialogue and invite reflection, but avoid repetitive patterns. Vary your responses to keep the conversation flowing naturally, and offer insights or gentle challenges when appropriate to help users gain new perspectives.
Aim to strike a balance between offering support and encouraging users to find their own solutions. When concluding a response, use a variety of techniques such as summarizing key points, reflecting on progress, or inviting the user to set a goal for further exploration.
Facilitate a genuinely supportive and therapeutic dialogue, adapting to each user's unique needs while maintaining a natural, engaging conversation.
Your primary tool is your ability to ask open-ended questions that encourage further sharing, thus deepening the therapeutic conversation. Aim for a natural conversation. `;

const INSTRUCTION = `Instructions: 1) Respond only to the last user message/question below, using the context provided above 
the last message as needed. 2) Greet user only on their first message, then it is not needed. 3) Start answer on last users message right away with
 advice or your opinion about the message, as a therapist you should choose the best option. 4) Respond in the same language the user uses.`;


const generateUserInstruction = (name, gender) => {
  const userGender = gender === "M" ? 'MALE' : 'FEMALE'; 
  return `Now a user with name ${name} and ${userGender} gender speaks to you. Refer to the user by their name in conversation and speak to the user using the appropriate gender pronouns.`;  
} 

const generateSystemPrompt = (userData) => {
  const prompt = BASIC_SYSPROMPT_MESSAGE + generateUserInstruction(userData.name, userData.gender);

  return prompt;
};

exports.generateMessageForHistory = (role, content) => {
  return {
    role,
    content,
    timestamp: Date.now(),
  };
};

const convertHistoryMessagesToText = (historyMessages) => {
  let str = `Context: The following are previous messages from the user. Use these for context only. \n Previous messages:`

  historyMessages.forEach((message) => {
    str += `${message.role}: ${message.content}.\n `;
  });
  str += INSTRUCTION;
  return str;
}

const convertHistoryMessagesToAiStyle = (historyMessages) => {
  return historyMessages.map((message) => {
    return message.role === 'user' ? new HumanMessage({content: message.content}) : new AIMessage({content: message.content});
  });
}

exports.createApiCall = async (userData, historyMessages, lastCachedMessageIndex, startCacheMessageIndex, input) => {

  let newLastCachedIndex = lastCachedMessageIndex;
  let newStartCacheIndex = startCacheMessageIndex;

  const sysprompt = generateSystemPrompt(userData);

  const calculatedIndex = startCacheMessageIndex !== 0 ? startCacheMessageIndex + 1 : 0;

  const {cached, uncached} = historyMessages.slice(calculatedIndex).reduce((acc, curr, i) => {
    if(lastCachedMessageIndex === 0) {
      if(curr.role === 'user') {
        acc.cached.push(curr);
      }
      return acc;
    } 
    if(startCacheMessageIndex === 0){
      if(curr.role === 'user') {
        if (i <= lastCachedMessageIndex) {
          acc.cached.push(curr);
        } else {
          acc.uncached.push(curr);
        }
      }
      return acc;
    }

    if(startCacheMessageIndex !== 0) {
      if(curr.role === 'user') {
        if (i < lastCachedMessageIndex - startCacheMessageIndex) {
          acc.cached.push(curr);
        } else {
          acc.uncached.push(curr);
        }
      }
    }

    return acc;
  }, {
    cached:[],
    uncached: [],
  });

  const cacheData = convertHistoryMessagesToText(cached);

  const uncachedData = convertHistoryMessagesToAiStyle(uncached)

  const messages = [
    new SystemMessage({content: [{
    type: 'text', text: sysprompt + cacheData, cache_control: {type: 'ephemeral'}
    }]}),
     ...uncachedData,
    new HumanMessage({content: input})
  ]

  const response = await model.invoke(messages);

  if(response.response_metadata.usage.cache_creation_input_tokens && lastCachedMessageIndex === 0) {
    newLastCachedIndex = historyMessages.length - 1 ;
  } else if ( response.response_metadata.usage.input_tokens > 600 && lastCachedMessageIndex !== 0) {
    newLastCachedIndex = historyMessages.length - 1;
    newStartCacheIndex = lastCachedMessageIndex
  }

  return {aiMessage: response.content, newLastCachedIndex, newStartCacheIndex};
};
