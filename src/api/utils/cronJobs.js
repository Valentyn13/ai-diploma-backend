const User = require('../models/user.model');
const logger = require('../../config/logger');

const calculateMeditationChallenge = async () => {
  try {
    await User.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $ifNull: ['$userProgress.minutesPracticed', 0],
            },
          },
        },
      },
      {
        $out: 'meditationchallenges',
      },
    ]);
  } catch (error) {
    logger.error('Error calculating meditation challenge: ', error);
  }
};

module.exports = {
  calculateMeditationChallenge,
};
