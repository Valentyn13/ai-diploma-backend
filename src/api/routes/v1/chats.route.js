const express = require('express');
const {authorize, LOGGED_USER_NO_ID} = require('../../middlewares/auth');
const chatController = require('../../controllers/chats.controller');
const router = express.Router();

router
  .route('/:sessionId')
  // GET CHAT BY ID
  .get(authorize(LOGGED_USER_NO_ID), chatController.loadById);
// DELETE CHAT BY ID
router.route('/:sessionId').delete(authorize(LOGGED_USER_NO_ID), chatController.delete);

// GET ALL CHATS
// NOTE: needs query param userId
router.route('/').get(authorize(LOGGED_USER_NO_ID), chatController.loadAll);

// CREATE CHAT
// NOTE: needs query param userId
// NOTE: needs body input
router.route('/create').post(authorize(LOGGED_USER_NO_ID), chatController.create);

router.route('/create/sse').post(authorize(LOGGED_USER_NO_ID), chatController.createStreamingChat);

// SEND MESSAGE TO AI IN CHAT
router.route('/message/:sessionId').post(authorize(LOGGED_USER_NO_ID), chatController.sendMessageToAi);
router.post('/message/sse/:sessionId', authorize(LOGGED_USER_NO_ID), chatController.sendMessageToSdkAiWithStreaming);

// GET LATEST CHAT ID
// NOTE: needs query param userId
router.get('/id/latest', chatController.getLatestChatId);

module.exports = router;
