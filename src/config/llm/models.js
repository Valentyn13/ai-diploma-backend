const ChatAnthropic = require('@langchain/anthropic').ChatAnthropic;
const Anthropic = require('@anthropic-ai/sdk');

exports.langchainAnthropicModel = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  temperature: 0.2,
  verbose: true,
  model: process.env.ANTHROPIC_MODEL,
  clientOptions: {
    defaultHeaders: {
      'anthropic-beta': 'prompt-caching-2024-07-31',
    },
  },
});

exports.sdkAnthropicModel = new Anthropic.Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  verbose: true,
  max_tokens: 2048,
});
