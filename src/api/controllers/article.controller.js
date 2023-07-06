const Article = require('../models/article.model');

/**
 * Get articles list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const articles = await Article.list(req.query);
    res.json({articles});
  } catch (error) {
    next(error);
  }
};
