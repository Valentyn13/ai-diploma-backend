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
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'info'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
instructorSchema.statics = {

  /**
   * List all instructors
   *
   * @returns {Promise<Instructor[]>}
   */
  list() {
    return this.find().exec();
  },
};

/**
 * @typedef Instructor
 */
module.exports = mongoose.model('Instructor', instructorSchema);
