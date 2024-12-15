const {authorize, LOGGED_USER_NO_ID} = require('../../middlewares/auth');
const controller = require('../../controllers/userInsight.controller');
const express = require('express');
const router = express.Router();

// get all user insight questions
router.route('/starter/questions').get(authorize(LOGGED_USER_NO_ID), controller.getQuestionsForUserInsight);

// submit user starter answers
router
  .route('/starter/submit/:userId')
  .post(authorize(LOGGED_USER_NO_ID), controller.generateUserInsightsBasedOnUserAnswers);

module.exports = router;
