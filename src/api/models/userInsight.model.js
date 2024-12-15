const mongoose = require('mongoose');

const userInsightSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    personalizedUserInsight: {
      summary: {
        type: String,
        default: '',
      },
      questionsAndAnswers: {
        type: [
          {
            question: {
              type: String,
            },
            answer: {
              type: String,
            },
          },
        ],
        default: [],
      },
    },
    chatContextUserInsight: {
      summary: {
        type: Object,
      },
    },
  },
  {
    timestamps: true,
  },
);

const UserInsight = mongoose.model('UserInsight', userInsightSchema);

module.exports = UserInsight;
