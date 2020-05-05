const express = require('express');
const controller = require('../../controllers/course.controller');

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} v1/courses List Courses
   * @apiDescription Get a list of courses
   * @apiVersion 1.0.0
   * @apiName ListCourses
   * @apiGroup Course
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {Object[]} courses List of courses.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(controller.list);

module.exports = router;
