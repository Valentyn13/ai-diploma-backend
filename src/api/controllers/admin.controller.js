const httpStatus = require('http-status');
const Category = require('../models/category.model');
const Meditation = require('../models/meditation.model');
const Course = require('../models/course.model');
const Instructor = require('../models/instructor.model');

exports.initSchema = async (req, res, next) => {
  try {
    const createdModels = {};

    const existingCategories = await Category.find();
    if (existingCategories.length === 0) {
      const category = new Category();
      const savedCategory = await category.save();
      createdModels.category = savedCategory;
    }

    let instructor;
    const existingInstructors = await Instructor.find();
    if (existingInstructors.length === 0) {
      instructor = new Instructor();
      const savedInstructor = await instructor.save();
      createdModels.instructor = savedInstructor;
    } else {
      [instructor] = existingInstructors;
    }

    const existingMeditations = await Meditation.find();
    if (existingMeditations.length === 0) {
      const meditation = new Meditation();
      const savedMeditation = await meditation.save();
      createdModels.meditation = savedMeditation;
    }

    const existingCourses = await Course.find();
    if (existingCourses.length === 0) {
      const course = new Course();
      course.instructor = instructor.id;
      course.name = 'קורס ראשון';
      const savedCourse = await course.save();
      createdModels.course = savedCourse;
    }

    res.status(httpStatus.CREATED);
    res.json(createdModels);
  } catch (error) {
    next(error);
  }
};
