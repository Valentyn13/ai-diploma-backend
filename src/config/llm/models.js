const Anthropic = require('@anthropic-ai/sdk');

exports.sdkAnthropicModel = new Anthropic.Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  verbose: true,
  max_tokens: 2048,
});
