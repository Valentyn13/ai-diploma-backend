const User = require('../models/user.model');
const UserInsight = require('../models/userInsight.model');
const UserInsightQuestion = require('../models/userInsightQuestion.model');
const {createSummarization} = require('../../config/llm/api');

exports.getQuestionsForUserInsight = async (req, res, next) => {
  try {
    const insights = await UserInsightQuestion.find();
    return res.status(200).json(insights);
  } catch (error) {
    next(error);
  }
};

exports.generateUserInsightsBasedOnUserAnswers = async (req, res, next) => {
  const userId = req.params.userId;
  const pollData = req.body;
  try {
    await User.findOneAndUpdate({_id: userId}, {hasPassedStarterChat: true});
    const pollEntries = Object.entries(pollData);

    const insights = await UserInsightQuestion.find();

    const questionAnswerLinking = pollEntries.map(([questionId, answer]) => {
      const insight = insights.find((i) => i._id.toString() === questionId);
      return {
        question: insight?.question,
        answer,
      };
    });
    const userSummary = await createSummarization(questionAnswerLinking);

    const insightObject = {
      personalizedUserInsight: {
        summary: userSummary,
        questionsAndAnswers: questionAnswerLinking,
      },
    };

    await UserInsight.findOneAndUpdate(
      {userId},
      {personalizedUserInsight: insightObject.personalizedUserInsight},
      {upsert: true},
    );

    return res.status(200).json({});
  } catch (error) {
    next(error);
  }
};
