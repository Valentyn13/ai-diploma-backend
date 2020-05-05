const Instructor = require('../models/instructor.model');

/**
 * Get instructors list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const instructors = await Instructor.list(req.query);
    const transformedInstructors = instructors.map(instructor => instructor.transform());
    res.json(transformedInstructors);
  } catch (error) {
    next(error);
  }
};
