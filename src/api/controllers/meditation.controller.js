const Meditation = require('../models/meditation.model');
const Course = require('../models/course.model');
const Category = require('../models/category.model');
const Instructor = require('../models/instructor.model');
const logger = require('../../config/logger');
const castToMongoID = require('../utils').castToMongoID;
/**
 * Get meditation list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const meditations = await Meditation.list(req.query);
    const transformedMeditations = meditations.map((meditation) => meditation.transform());
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
    const categories = await Category.list(req.query);
    const courses = await Course.list(req.query);
    const instructors = await Instructor.list(req.query);
    res.json({
      categories,
      courses,
      instructors,
    });
  } catch (error) {
    next(error);
  }
};
exports.updateMeditationCount = async (req, res, next) => {
  try {
    const {data} = req.body;
    const id = castToMongoID(data);

    const findMeditation = await Meditation.updateOne({_id: id}, {$inc: {count: 1}});

    return res.json('success');
  } catch (error) {
    logger.info('updateMeditationCount failed', error);
    next(error);
  }
};
