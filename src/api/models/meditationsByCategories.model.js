const mongoose = require('mongoose');

const MEDITATION_CATEGORY_ENUM = ['body-mind', 'quiet-soul', 'self-development', 'basics', 'self-connection', 'reduce-stress', 'self-love', 'healthy-life', 'focus-motivation', 'better-sleep'];

const meditationsByCategories = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        enum: MEDITATION_CATEGORY_ENUM,
    },
    title: {
        type: String,
        required: true,
    },
    trackIds: {
        type: [String],
        required: true,
    },
});

module.exports = mongoose.model('MeditationByCategories', meditationsByCategories);
