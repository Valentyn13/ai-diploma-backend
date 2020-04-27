const mongoose = require('mongoose');

/**
 * Instructor Schema
 * @private
 */
const instructorSchema = new mongoose.Schema({
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

}, {
  timestamps: true,
});


/**
 * Methods
 */
instructorSchema.method({
});

/**
 * Statics
 */
instructorSchema.statics = {


};

/**
 * @typedef User
 */
module.exports = mongoose.model('Instructor', instructorSchema);
