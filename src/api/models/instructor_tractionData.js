const mongoose = require('mongoose');

/**
 * Instructor Schema
 * @private
 */
const instructor_tractionDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
    },
    name: {
      type: String,
      maxlength: 128,
      index: true,
      trim: true,
    },
    instructorName: {
      type: String,
      trim: true,
    },
    social_link_press: {
      type: Boolean,
      default: false,
    },
    button_press: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Methods
 */

/**
 * Statics
 */
instructor_tractionDataSchema.statics = {
  /**
   * List all instructors
   *
   * @returns {Promise<instructor_tractionData[]>}
   */
  list() {
    return this.find().lean().exec();
  },
};

/**
 * @typedef instructor_tractionData
 */
module.exports = mongoose.model('Instructor_tractionData', instructor_tractionDataSchema);
