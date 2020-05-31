const Category = require('../models/category.model');

/**
 * Get categories list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const categories = await Category.list(req.query);
    res.json({categories});
  } catch (error) {
    next(error);
  }
};
