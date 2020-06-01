const express = require('express');
const controller = require('../../controllers/meditation.controller');
const {authorize, LOGGED_USER_NO_ID} = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} v1/meditations List Meditations
   * @apiDescription Get a list of meditations
   * @apiVersion 1.0.0
   * @apiName ListMeditations
   * @apiGroup Meditation
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {Object[]} meditations List of meditations.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(authorize(LOGGED_USER_NO_ID), controller.list);

router
  .route('/all')
  /**
   * @api {get} v1/meditations/all List ALL data - Meditations, Courses, Categories & Instructors
   * @apiDescription Get a list of meditations, courses, categories & instructors
   * @apiVersion 1.0.0
   * @apiName ListAll
   * @apiGroup Meditation
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {Object} object contains all lists
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(authorize(LOGGED_USER_NO_ID), controller.listAll);

module.exports = router;
