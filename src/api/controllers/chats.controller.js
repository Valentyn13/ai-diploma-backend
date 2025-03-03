const mongoose = require('mongoose');
const validateObjectId = require('../validations/isObjectId');
const validateChatInput = require('../validations/validateChatInput');
const {generateMessageForHistory} = require('../../config/llm/helpers');
const {createSdkApiCall} = require('../../config/llm/api');
const User = require('../models/user.model');
const Chats = require('../models/chats.model');
const UserInsight = require('../models/userInsight.model');

exports.loadById = async (req, res, next) => {
  const id = req.params.sessionId;
  try {
    validateObjectId(id);
    const chat = await Chats.getChatById(id);
    return res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};

exports.getLatestChatId = async (req, res, next) => {
  const userId = req.query.userId;
  try {
    const user = await User.findById(userId).select('lastActiveSessionId');
    if (!user.lastActiveSessionId) {
      return res.status(200).json({lastActiveSessionId: null});
    }
    return res.status(200).json({lastActiveSessionId: user.lastActiveSessionId});
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  const sessionId = req.params.sessionId;
  try {
    validateObjectId(sessionId);

    const chat = await Chats.deleteChat(sessionId);

    const user = await User.findById(chat.userId).select('lastActiveSessionId');
    const latestIndex = user.lastActiveSessionId;
    if (latestIndex && latestIndex.toString() === sessionId.toString()) {
      await User.updateOne({_id: chat.userId}, {$unset: {lastActiveSessionId: 1}});
    }

    return res.status(200).json({deleted: true});
  } catch (error) {
    next(error);
  }
};

exports.loadAll = async (req, res, next) => {
  const id = req.query.userId;
  try {
    validateObjectId(id);
    const chats = await Chats.getUserChats(id);
    return res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

exports.createStreamingChat = async (req, res, next) => {
  const input = req.body.input;
  const userId = req.query.userId;
  const chatType = req.query.chatType;

  const objectId = new mongoose.Types.ObjectId();
  const stringIdRepresentation = objectId.toString();

  try {
    validateObjectId(userId);
    validateChatInput(input);

    await User.get(userId);

    const userMessageForHistory = generateMessageForHistory('user', input);

    if (!chatType) {
      const chat = await Chats.create({
        _id: objectId,
        sessionId: stringIdRepresentation,
        messages: [userMessageForHistory],
        userId,
      });
      res.status(200).json(chat);
      await User.findByIdAndUpdate(userId, {lastActiveSessionId: chat._id}).select('lastActiveSessionId');

      return;
    }

    const chat = await Chats.create({
      _id: objectId,
      category: chatType,
      sessionId: stringIdRepresentation,
      messages: [userMessageForHistory],
      userId,
    });

    await User.findByIdAndUpdate(userId, {lastActiveSessionId: chat._id}).select('lastActiveSessionId');

    return res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};

exports.sendMessageToSdkAiWithStreaming = async (req, res, next) => {
  const sessionId = req.params.sessionId;
  const input = req.body.input;
  const chatType = req.query.chatType;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    validateObjectId(sessionId);
    validateChatInput(input);

    const chat = await Chats.getChatById(sessionId);

    const user = await User.get(chat.userId);

    const userInsight = await UserInsight.findOne({userId: user._id});

    const categoriesSummary = userInsight?.chatContextUserInsight?.summary || {};

    const personalSummary = userInsight?.personalizedUserInsight?.summary || '';

    const lastSessionIndex = user.lastActiveSessionId;

    const userData = {
      name: user.name,
      gender: user.sex,
    };

    const shouldUpdate = lastSessionIndex ? lastSessionIndex.toString() !== sessionId.toString() : true;
    if (shouldUpdate) {
      await User.findByIdAndUpdate(user._id, {lastActiveSessionId: sessionId}).select('lastActiveSessionId');
    }

    const isLastCachedIndexExist = !!chat.lastCachedMessageIndex;
    let lastCachedMessageIndex = isLastCachedIndexExist ? chat.lastCachedMessageIndex : 0;

    const isStartCacheMessageIndex = !!chat.startCacheMessageIndex;
    let startCacheMessageIndex = isStartCacheMessageIndex ? chat.startCacheMessageIndex : 0;

    const modelResponse = await createSdkApiCall(
      userData,
      chat.messages,
      lastCachedMessageIndex,
      startCacheMessageIndex,
      input,
      chatType,
      personalSummary,
      categoriesSummary,
      res,
    );

    const aiMessage = modelResponse.aiMessage;
    const newLastCachedIndex = modelResponse.newLastCachedIndex;
    const newStartCacheIndex = modelResponse.newStartCacheIndex;

    const aiMessageForHistory = generateMessageForHistory('assistant', aiMessage);
    const userMessageForHistory = generateMessageForHistory('user', input);

    if (chat.messages.length <= 1) {
      await Chats.findByIdAndUpdate(sessionId, {
        $push: {
          messages: {
            $each: [aiMessageForHistory],
          },
        },
        startCacheMessageIndex: newStartCacheIndex,
        lastCachedMessageIndex: newLastCachedIndex,
      });
    } else {
      await Chats.findByIdAndUpdate(sessionId, {
        $push: {
          messages: {
            $each: [userMessageForHistory, aiMessageForHistory],
          },
        },
        startCacheMessageIndex: newStartCacheIndex,
        lastCachedMessageIndex: newLastCachedIndex,
      });
    }

    res.end();

    res.on('close', () => {
      res.end();
    });

    return;
  } catch (error) {
    console.log(error)
    next(error);
  }
};