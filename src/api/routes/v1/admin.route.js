const express = require('express');
const controller = require('../../controllers/admin.controller');

const router = express.Router();

router.route('/init-schema').get(controller.initSchema);
router.route('/send-test-notification').post(controller.sendTestNotification);
module.exports = router;
