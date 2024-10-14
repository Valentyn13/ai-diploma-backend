const MeditationChallenge = require('../models/meditationChallenge.model');


exports.loadChallengeData = async (req, res, next) => {
    try {
        const response = await MeditationChallenge.find();
        const minutes = response[0].total / 60;
        return res.json({progress: Number(minutes.toFixed(0))});
    } catch (error) {
        next(error)
    }
}