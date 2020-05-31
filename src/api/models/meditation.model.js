const mongoose = require('mongoose');

/**
 * User Schema
 * @private
 */
const meditationSchema = new mongoose.Schema(
  {
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
    duration: {
      type: Number,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Methods
 */
meditationSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'url', 'categories', 'instructor', 'duration'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
meditationSchema.statics = {
  /**
   * List all meditations
   *
   * @returns {Promise<Meditation[]>}
   */
  list() {
    return this.find().exec();
  },
};

/**
 * @typedef Meditation
 */
module.exports = mongoose.model('Meditation', meditationSchema);
