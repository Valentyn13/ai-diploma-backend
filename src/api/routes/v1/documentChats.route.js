const express = require('express');
const {authorize, LOGGED_USER_NO_ID} = require('../../middlewares/auth');
const documentChatController = require('../../controllers/documentChats.controller');
const router = express.Router();

router
  .route('/:sessionId')
  // GET CHAT BY ID
  .get(authorize(LOGGED_USER_NO_ID), documentChatController.loadById);
// DELETE CHAT BY ID
router.route('/:sessionId').delete(authorize(LOGGED_USER_NO_ID), documentChatController.delete);

// GET ALL CHATS
// NOTE: needs query param userId
router.route('/').get(authorize(LOGGED_USER_NO_ID), documentChatController.loadAll);

// CREATE CHAT
// NOTE: needs query param userId
// NOTE: needs body input

router.route('/create/sse').post(authorize(LOGGED_USER_NO_ID), documentChatController.createStreamingChat);

// SEND MESSAGE TO AI IN CHAT
router.post('/message/sse/:sessionId', authorize(LOGGED_USER_NO_ID), documentChatController.sendMessageToSdkAiWithStreaming);

// PROCESS PDF DOCUMENT
router.post('/process/pdf', documentChatController.processPdfDocument);

module.exports = router;
