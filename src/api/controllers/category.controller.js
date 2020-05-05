const Category = require('../models/category.model');

/**
 * Get categories list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const categories = await Category.list(req.query);
    const transformedCategories = categories.map(category => category.transform());
    res.json(transformedCategories);
  } catch (error) {
    next(error);
  }
};
