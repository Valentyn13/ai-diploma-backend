const express = require('express');
const controller = require('../../controllers/revenuecat.controller');
const authenticateRevenueCat = require('../../middlewares/revenuecat');

const router = express.Router();

router
  .route('/webhook')
  /**
   * @api {post} v1/revenuecat/webhook RevenueCat Webhook
   * @apiDescription Post RevenueCat Event notifications
   * @apiVersion 1.0.0
   * @apiName RevenueCatWebhook
   * @apiGroup RevenueCat
   *
   * @apiHeader {String} Authorization   RevenueCat Secret
   *
   * @apiSuccess {String} OK
   *
   * @apiError (Unauthorized 401)  Unauthorized  Header Secret Wrong
   */
  .post(authenticateRevenueCat, controller.webhook);

module.exports = router;
