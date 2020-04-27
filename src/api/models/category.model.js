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
});

/**
 * Statics
 */
categorySchema.statics = {


};

/**
 * @typedef User
 */
module.exports = mongoose.model('Category', categorySchema);
