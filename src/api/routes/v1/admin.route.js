const express = require('express');
const controller = require('../../controllers/admin.controller');

const router = express.Router();

router.route('/init-schema').get(controller.initSchema);

module.exports = router;
