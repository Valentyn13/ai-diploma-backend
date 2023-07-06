const mongoose = require('mongoose');

/**
 * Article Schema
 * @private
 */
const articleSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      maxlength: 2048,
      index: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      maxlength: 2048,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Methods
 */
articleSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'url', 'thumbnail', 'title', 'description'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
articleSchema.statics = {
  /**
   * List all articles
   *
   * @returns {Promise<Article[]>}
   */
  list() {
    return this.find().lean().exec();
  },
};

/**
 * @typedef Article
 */
module.exports = mongoose.model('Article', articleSchema);
