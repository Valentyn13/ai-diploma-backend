const express = require('express');
const controller = require('../../controllers/instructor.controller');

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} v1/instructors List Instructors
   * @apiDescription Get a list of instructors
   * @apiVersion 1.0.0
   * @apiName ListInstructors
   * @apiGroup Instructor
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {Object[]} instructors List of instructors.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(controller.list);

module.exports = router;
