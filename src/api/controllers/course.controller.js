const Course = require('../models/course.model');

/**
 * Get courses list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const courses = await Course.list(req.query);
    const transformedCourses = courses.map(course => course.transform());
    res.json(transformedCourses);
  } catch (error) {
    next(error);
  }
};
