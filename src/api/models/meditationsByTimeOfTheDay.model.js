const mongoose = require('mongoose');

const TIME_OF_THE_DAY_ENUM = ['night', 'evening', 'afternoon', 'morning', 'noon'];

const meditationsByTimeOfTheDaySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        enum: TIME_OF_THE_DAY_ENUM,
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

module.exports = mongoose.model('MeditationsByTimeOfTheDay', meditationsByTimeOfTheDaySchema);
