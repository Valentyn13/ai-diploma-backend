const Chats = require('../models/chats.model');
const AIModel = require('../../config/llm');
const User = require('../models/user.model')

exports.loadById = async (req, res, next) => {
  try {
    const chat = await Chats.getChatById(req.params.sessionId);
    res.status(200).json(chat);
  } catch (error) {
    next(error)
  }
};

exports.delete = async (req, res, next) => {
  const id = req.params.sessionId;
  try {
    await Chats.deleteChat(id);
    res.status(200).json({deleted: true});
  } catch (error) {
    next(error)
  }

};

exports.loadAll = async (req, res, next) => {
  try {
    const chats = await Chats.getUserChats(req.query.userId);
    res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  const input = req.body.input;
  const userId = req.query.userId;
  try {
    const chat = await Chats.createChat(input, userId);
    res.status(200).json(chat);
  } catch (error) {
    console.log(error)
    next(error);
  }
};

exports.sendMessageToAi = async (req, res, next) => {
  const sessionId = req.params.sessionId;
  const input = req.body.input;
  try {

    const chat = await Chats.getChatById(sessionId);

    const user = await User.get(chat.userId);

    const userData = {
      name: user.name,
      gender: user.sex,
    }

   const isLastCachedIndexExist  = !!chat.lastCachedMessageIndex
   let lastCachedMessageIndex = isLastCachedIndexExist ? chat.lastCachedMessageIndex : 0;

   const isStartCacheMessageIndex = !!chat.startCacheMessageIndex
   let startCacheMessageIndex = isStartCacheMessageIndex ? chat.startCacheMessageIndex : 0;


    const modelResponse = await AIModel.createApiCall(userData, chat.messages, lastCachedMessageIndex, startCacheMessageIndex, input);

    const aiMessage = modelResponse.aiMessage
    const newLastCachedIndex = modelResponse.newLastCachedIndex
    const newStartCacheIndex = modelResponse.newStartCacheIndex

    const aiMessageForHistory = AIModel.generateMessageForHistory('assistant', aiMessage);
    const userMessageForHistory = AIModel.generateMessageForHistory('user', input);
   
    await Chats.findByIdAndUpdate(
      sessionId,
      {
        $push: {
          messages: {
            $each: [userMessageForHistory, aiMessageForHistory],
          },
        },
        startCacheMessageIndex : newStartCacheIndex,
        lastCachedMessageIndex: newLastCachedIndex
      },
    );

    res.status(200).json(aiMessageForHistory);
  } catch (error) {
    next(error);
  }
};
