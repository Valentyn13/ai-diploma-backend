const Course = require('../models/course.model');

/**
 * Get courses list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const courses = await Course.list(req.query);

    res.json({courses});
  } catch (error) {
    next(error);
  }
};
