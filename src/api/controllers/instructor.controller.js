const Instructor = require('../models/instructor.model');

/**
 * Get instructors list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const instructors = await Instructor.list(req.query);
    res.json({instructors});
  } catch (error) {
    next(error);
  }
};
