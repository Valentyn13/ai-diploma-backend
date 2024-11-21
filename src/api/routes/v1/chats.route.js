const express = require('express');
const {authorize, LOGGED_USER_NO_ID} = require('../../middlewares/auth');
const controller = require('../../controllers/chats.controller');

const router = express.Router();

router
  .route('/:sessionId')
  // GET CHAT BY ID
  .get(authorize(LOGGED_USER_NO_ID), controller.loadById);
// DELETE CHAT BY ID
router.route('/:sessionId').delete(authorize(LOGGED_USER_NO_ID), controller.delete);

// GET ALL CHATS
// NOTE: needs query param userId
router.route('/').get(authorize(LOGGED_USER_NO_ID), controller.loadAll);

// CREATE CHAT
// NOTE: needs query param userId
// NOTE: needs body input
router.route('/create').post(authorize(LOGGED_USER_NO_ID), controller.create);

router.route('/create/sse').post(authorize(LOGGED_USER_NO_ID), controller.createStreamingChat);

// SEND MESSAGE TO AI IN CHAT
router.route('/message/:sessionId').post(authorize(LOGGED_USER_NO_ID), controller.sendMessageToAi);
router.post('/message/sse/:sessionId', authorize(LOGGED_USER_NO_ID), controller.sendMessageToSdkAiWithStreaming);

// GET LATEST CHAT ID
// NOTE: needs query param userId
router.get('/id/latest', controller.getLatestChatId);

module.exports = router;
