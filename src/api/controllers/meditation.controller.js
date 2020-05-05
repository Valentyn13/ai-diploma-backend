const Meditation = require('../models/meditation.model');
const Course = require('../models/course.model');
const Category = require('../models/category.model');
const Instructor = require('../models/instructor.model');

/**
 * Get meditation list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const meditations = await Meditation.list(req.query);
    const transformedMeditations = meditations.map(meditation => meditation.transform());
    res.json(transformedMeditations);
  } catch (error) {
    next(error);
  }
};

/**
 * Get meditation, category, courses & instructor list
 * @public
 */
exports.listAll = async (req, res, next) => {
  try {
    const meditations = await Meditation.list(req.query);
    const transformedMeditations = meditations.map(meditation => meditation.transform());

    const courses = await Course.list(req.query);
    const transformedCourses = courses.map(course => course.transform());

    const categories = await Category.list(req.query);
    const transformedCategories = categories.map(category => category.transform());

    const instructors = await Instructor.list(req.query);
    const transformedInstructors = instructors.map(instructor => instructor.transform());

    res.json({
      meditations: transformedMeditations,
      courses: transformedCourses,
      categories: transformedCategories,
      instructors: transformedInstructors,
    });
  } catch (error) {
    next(error);
  }
};
