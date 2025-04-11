const { BASIC_SYSPROMPT_MESSAGE, PROMPTS} = require('./prompts');

const generateUserInstruction = (name, gender) => {
  const userGender = gender === 'M' ? 'чоловічим' : 'жіночим';

  return `Зараз користувач з іменем ${name} і ${userGender} гендером говорить з тобою. Використовую правильне взернення до користувача в залежноті від гендеру.`;
};

const generateSystemPrompt = (userData, chatType) => {
  const categorySysprompt = PROMPTS[chatType] || '';
  const basePrompt = BASIC_SYSPROMPT_MESSAGE + categorySysprompt;

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
  let str = `Context: The following are previous messages in conversation. Use these for context only.\nPrevious messages:\n`;

  historyMessages.forEach((message) => {
    str += `${message.role}: ${message.content}.\n `;
  });

  return str;
};


const convertHistorySdkMessage = (historyMessages) => {
  return historyMessages.map((message) => {
    return message.role === 'user'
      ? {role: 'user', content: message.content}
      : {role: 'assistant', content: message.content};
  });
};

module.exports = {
  generateUserInstruction,
  generateSystemPrompt,
  generateMessageForHistory,
  convertHistoryMessagesToText,
  convertHistorySdkMessage,
};
