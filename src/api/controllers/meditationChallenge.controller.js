const MeditationChallenge = require('../models/meditationChallenge.model');

exports.loadChallengeData = async (req, res, next) => {
  try {
    const response = await MeditationChallenge.find();
    const minutes = response[0].total.toFixed(0);
    return res.json({progress: minutes});
  } catch (error) {
    next(error);
  }
};
