const express = require('express');

const controller = require('../../controllers/chats.controller');

const router = express.Router();

router
  .route('/:sessionId')
  // GET CHAT BY ID
  .get(controller.loadById);
// DELETE CHAT BY ID
router.route('/:sessionId').delete(controller.delete);

// GET ALL CHATS
// NOTE: needs query param userId
router.route('/').get(controller.loadAll);

// CREATE CHAT
// NOTE: needs query param userId
// NOTE: needs body input
router.route('/create').post(controller.create);

router.route('/create/sse').post(controller.createStreamingChat);

// SEND MESSAGE TO AI IN CHAT
router.route('/message/:sessionId').post(controller.sendMessageToAi);
router.post('/message/sse/:sessionId', controller.sendMessageToSdkAiWithStreaming);

module.exports = router;
