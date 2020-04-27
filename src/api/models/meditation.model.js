const mongoose = require('mongoose');

/**
 * User Schema
 * @private
 */
const meditationSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  url: {
    type: String,
    maxlength: 256,
    index: true,
    trim: true,
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
  },

}, {
  timestamps: true,
});


/**
 * Methods
 */
meditationSchema.method({
});

/**
 * Statics
 */
meditationSchema.statics = {


};

/**
 * @typedef User
 */
module.exports = mongoose.model('Meditation', meditationSchema);
