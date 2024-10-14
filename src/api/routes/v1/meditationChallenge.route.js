const express = require('express');

const controller = require('../../controllers/meditationChallenge.controller');

const router = express.Router();

router.route('/').get(controller.loadChallengeData);

module.exports = router;
