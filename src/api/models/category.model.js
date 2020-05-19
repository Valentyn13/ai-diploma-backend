const mongoose = require('mongoose');

/**
 * Category Schema
 * @private
 */
const categorySchema = new mongoose.Schema({
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
}, {
  timestamps: true,
});


/**
 * Methods
 */
categorySchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'title', 'info'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

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
    return this.find().exec();
  },
};


/**
 * @typedef Category
 */
module.exports = mongoose.model('Category', categorySchema);
