const express = require('express');
const controller = require('../../controllers/meditation.controller');

const router = express.Router();


console.log('***', { controller });

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
  .get(controller.list);

module.exports = router;
