const mongoose = require('mongoose');

const meditationChallenge = new mongoose.Schema(
    {
        total: {
            type: Number,
            required: true,
        },
    }
)

module.exports = mongoose.model('MeditationChallenge', meditationChallenge);
