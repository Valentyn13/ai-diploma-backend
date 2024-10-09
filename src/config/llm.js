const ChatAnthropic = require('@langchain/anthropic').ChatAnthropic;
const {HumanMessage, AIMessage} = require('@langchain/core/messages');
const {ChatPromptTemplate, PromptTemplate} = require('@langchain/core/prompts');
const {ConversationSummaryBufferMemory} = require('langchain/memory');

const BASIC_SYSPROMPT_MESSAGE = `You are מיכאל, a world-class therapist with 30 years of experience at "רגע", with a passion for supporting and understanding your users through conversation. You are an Israeli, Native Hebrew speaker. You aim to create a safe and open space for users to express their feelings and thoughts. Engage users by asking insightful questions, listening to their responses, Validate emotions when appropriate, but focus on encouraging users to explore their feelings and experiences in their own words.
Ask open-ended questions that deepen the dialogue and invite reflection, but avoid repetitive patterns. Vary your responses to keep the conversation flowing naturally, and offer insights or gentle challenges when appropriate to help users gain new perspectives.
Aim to strike a balance between offering support and encouraging users to find their own solutions. When concluding a response, use a variety of techniques such as summarizing key points, reflecting on progress, or inviting the user to set a goal for further exploration.
Facilitate a genuinely supportive and therapeutic dialogue, adapting to each user's unique needs while maintaining a natural, engaging conversation.
Your primary tool is your ability to ask open-ended questions that encourage further sharing, thus deepening the therapeutic conversation. Aim for a natural conversation. `;

const NAME_INSTRUCTIONS = 'If you receive a Hebrew personal name, refer to the user by their name in conversation. ';

const GENDER_INSTRUCTIONS =
  'Each user is either MALE or FEMALE. Speak to the user using the appropriate gender pronouns. ';

// const MODEL_SONNET = 'claude-3-5-sonnet-20240620';
// const MODEL_HAIKU = 'claude-3-haiku-20240307'

const model = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  temperature: 0.2,
  verbose: true,
  model: process.env.ANTHROPIC_MODEL,
});

const generateSystemPrompt = () => {
  const prompt = BASIC_SYSPROMPT_MESSAGE + NAME_INSTRUCTIONS + GENDER_INSTRUCTIONS;

  return prompt;
};

exports.generateMessageForHistory = (role, content) => {
  return {
    role,
    content,
    timestamp: Date.now(),
  };
};
const summaryTemplate = `
Shortly summarize the lines of conversation provided,
adding new important details to current summary. If the summary is already has 4 or more sentences rewrite the 
full summary, keep only important things in it. Write new summary after words "New summary:".
Current summary:\n{summary}\n\n\nNew lines of conversation:\n{new_lines}\nNew summary:`;

const summaryPrompt = new PromptTemplate({
  inputVariables: ['new_lines', 'summary'],
  template: summaryTemplate,
});

const prompt = ChatPromptTemplate.fromTemplate(
  `
  System: ${generateSystemPrompt()}
  Conversation context: {prevSummary}.
  User: {input}.
  Assistant:
  `,
);

const memory = new ConversationSummaryBufferMemory({
  llm: model,
  aiPrefix: 'assistant',
  humanPrefix: 'user',
  maxTokenLimit: 20,
  prompt: summaryPrompt,
});

exports.createApiCall = async (historyMessages, prevSummary, input) => {
  let newSummary = null;

  const chain = prompt.pipe(model);

  const response = await chain.invoke({input, prevSummary});

  const convertedMessagesFromUser = new HumanMessage(input);
  const convertedMessagesFromAI = new AIMessage(response.content);

  const generatedSummaryResponse = await memory.predictNewSummary(
    [convertedMessagesFromUser, convertedMessagesFromAI],
    prevSummary,
  );
  const parts = generatedSummaryResponse.split('\n');
  newSummary = parts[parts.length - 1];

  return {aiMessage: response.content, summary: newSummary};
};
