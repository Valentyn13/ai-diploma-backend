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
  meditations: [{
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
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'info', 'meditations', 'instructor'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
courseSchema.statics = {

  /**
   * List all courses
   *
   * @returns {Promise<Course[]>}
   */
  list() {
    return this.find().exec();
  },
};


/**
 * @typedef Course
 */
module.exports = mongoose.model('Course', courseSchema);
