const express = require('express');
const AppConfig = require('../../models/appConfig.model');

const router = express.Router();

const MINIMUM_APP_VERSION_KEY = 'MINIMUM_APP_VERSION';

router.route('/minimum_app_version').get(async (req, res, next) => {
  try {
    const configRecord = await AppConfig.findOne({type: MINIMUM_APP_VERSION_KEY});

    const config = configRecord.config;

    return res.status(200).json(config);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
