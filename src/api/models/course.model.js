const mongoose = require('mongoose');

/**
 * Course Schema
 * @private
 */
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  info: {
    type: String,
    trim: true,
  },
  meditation: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meditations',
  }],
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    required: true,
  },
}, {
  timestamps: true,
});


/**
 * Methods
 */
courseSchema.method({
});

/**
 * Statics
 */
courseSchema.statics = {


};

/**
 * @typedef User
 */
module.exports = mongoose.model('Course', courseSchema);
