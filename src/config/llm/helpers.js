const {HumanMessage, AIMessage} = require('@langchain/core/messages');
const {INSTRUCTION, BASIC_SYSPROMPT_MESSAGE, PROMPTS} = require('./prompts');

const generateUserInstruction = (name, gender) => {
  const userGender = gender === 'M' ? 'MALE' : 'FEMALE';

  return `Now a user with name ${name} and ${userGender} gender speaks to you. Refer to the user by their name in conversation and speak to the user using the appropriate gender pronouns.`;
};

const generateSystemPrompt = (userData, chatType) => {
  const basePrompt = PROMPTS[chatType] || BASIC_SYSPROMPT_MESSAGE;

  const prompt = `${basePrompt}\n\n${generateUserInstruction(userData.name, userData.gender)}`;

  return prompt;
};

const generateMessageForHistory = (role, content) => {
  return {
    role,
    content,
    timestamp: Date.now(),
  };
};

const convertHistoryMessagesToText = (historyMessages) => {
  let str = `Context: The following are previous messages from the user. Use these for context only. \n Previous messages:`;

  historyMessages.forEach((message) => {
    str += `${message.role}: ${message.content}.\n `;
  });
  str += INSTRUCTION;

  return str;
};

const convertHistoryMessagesToAiStyle = (historyMessages) => {
  return historyMessages.map((message) => {
    return message.role === 'user'
      ? new HumanMessage({content: message.content})
      : new AIMessage({content: message.content});
  });
};

const convertHistorySdkMessage = (historyMessages) => {
  return historyMessages.map((message) => {
    return message.role === 'user'
      ? {role: 'user', content: message.content}
      : {role: 'assistant', content: message.content};
  });
};

module.exports = {
  generateSystemPrompt,
  generateMessageForHistory,
  convertHistoryMessagesToText,
  convertHistoryMessagesToAiStyle,
  convertHistorySdkMessage,
};
