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
    premium: {
      type: Boolean,
      index: true,
    },
    animation: {
      type: String,
      maxlength: 256,
      trim: true,
    },
    thumbnail: {
      type: String,
      maxlength: 256,
      trim: true,
    },
    count: {
      type: Number,
    },
    createdAt: {
      type: Date,
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
    const fields = ['id', 'name', 'url', 'categories', 'instructor', 'duration', 'premium'];

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
