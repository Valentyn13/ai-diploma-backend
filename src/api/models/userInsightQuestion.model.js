const mongoose = require('mongoose');

const userInsightQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
});

const userInsightQuestion = mongoose.model('UserInsightQuestion', userInsightQuestionSchema);

module.exports = userInsightQuestion;
