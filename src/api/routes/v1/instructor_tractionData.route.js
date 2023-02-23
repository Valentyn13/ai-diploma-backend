const express = require('express');
const controller = require('../../controllers/instructor_tractionData.controller');

const router = express.Router();
const {authorize, ADMIN, LOGGED_USER} = require('../../middlewares/auth');

router
  .route('/')
  /**
   * @api {get} v1/category List Categories
   * @apiDescription Get a list of categories
   * @apiVersion 1.0.0
   * @apiName ListCategories
   * @apiGroup Category
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {Object[]} categories List of categories.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
  //  */
  .post(authorize(), controller.saveInstructor_tractionData);

module.exports = router;
