const mongoose = require('mongoose');

/**
 * Category Schema
 * @private
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 128,
      index: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 128,
    },
    info: {
      type: String,
      trim: true,
    },
    meditations: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Meditation',
    },
    order: {
      type: Number,
    },
    isCategoryLocked: {
      type: Boolean,
    },
    showInHome: {
      type: Boolean,
    },
    hideInMeditations: {
      type: Boolean,
    },
    height: {
      type: String,
      enum: ['small', 'medium', 'large'],
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Methods
 */
// categorySchema.method({
//   transform() {
//     const transformed = {};
//     const fields = ['id', 'name', 'title', 'info', 'meditations'];

//     fields.forEach((field) => {
//       transformed[field] = this[field];
//     });

//     return transformed;
//   },
// });

/**
 * Statics
 */
categorySchema.statics = {
  /**
   * List all categories
   *
   * @returns {Promise<Category[]>}
   */
  list() {
    return this.find().populate({path: 'meditations', model: 'Meditation'}).lean().exec();
  },
};

/**
 * @typedef Category
 */
module.exports = mongoose.model('Category', categorySchema);
