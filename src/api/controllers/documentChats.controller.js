const mongoose = require('mongoose');

const DocumentChats = require('../models/documentChats.model');
const User = require('../models/user.model');
const s3 = require('../../config/s3');
const {generateMessageForHistory} = require('../../config/llm/helpers');
const {createSdkApiCall, pdfFileProcessing} = require('../../config/llm/api');

const validateObjectId = require('../validations/isObjectId');
const validateChatInput = require('../validations/validateChatInput');

exports.processPdfDocument = async (req, res, next) => {
  try {
    const {file} = req.body;
    console.log(file);
    // const response = await pdfFileProcessing();
    return res.status(200).json({
      Done: true,
    });
  } catch (error) {
    next(error);
  }
};

exports.loadById = async (req, res, next) => {
  const id = req.params.sessionId;
  try {
    validateObjectId(id);
    const chat = await DocumentChats.getDocumentChatById(id);
    return res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  const sessionId = req.params.sessionId;
  try {
    validateObjectId(sessionId);

    const chat = await DocumentChats.deleteChat(sessionId);

    return res.status(200).json({deleted: true});
  } catch (error) {
    next(error);
  }
};

exports.loadAll = async (req, res, next) => {
  const id = req.query.userId;
  try {
    validateObjectId(id);
    const chats = await DocumentChats.getUserDocumentChats(id);
    return res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

exports.createStreamingChat = async (req, res, next) => {
  const userId = req.query.userId;

  const input = req.body.input;
  const chatName = req.body.chatName;
  const category = req.body.category;
  const cachedPath = req.body.cachedPath;

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
}

  const objectId = new mongoose.Types.ObjectId();

  try {
    validateObjectId(userId);
    validateChatInput(input);

    await User.get(userId);

    const userMessageForHistory = generateMessageForHistory('user', input);


    const uploadParams = {
      Bucket: 'pdf-files-for-ai',
      Key: `pdf/${Date.now()}-${req.file.originalname}`, // Unique file name
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
  };

  const data = await s3.upload(uploadParams).promise();

    const chat = await DocumentChats.create({
      _id: objectId,
      chatName,
      document: data.Location,
      category,
      cachedFilePath: cachedPath,
      messages: [userMessageForHistory],
      userId,
    });

    const chatObj = chat.toObject(); // Convert Mongoose document to plain object
    delete chatObj.document; // Remove the 'document' field

    return res.status(200).json(chatObj);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.sendMessageToSdkAiWithStreaming = async (req, res, next) => {
  const sessionId = req.params.sessionId;
  const input = req.body.input;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    validateObjectId(sessionId);
    validateChatInput(input);

    const chat = await DocumentChats.getDocumentChatById(sessionId);

    const user = await User.get(chat.userId);

    const userData = {
      name: user.name,
      gender: user.sex,
    };

    // Simulate striming

    const chunks = ['chunk1', 'chunk2', 'chunk3', 'chunk4', 'chunk5'];

    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of chunks) {
      res.write(chunk);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }


    // const modelResponse = await createSdkApiCall(userData, chat.messages, input, chatType, res);

    // const aiMessage = modelResponse.aiMessage;

    const aiMessageForHistory = generateMessageForHistory('assistant', chunks.join(''));
    const userMessageForHistory = generateMessageForHistory('user', input);

    if (chat.messages.length <= 1) {
      await DocumentChats.findByIdAndUpdate(sessionId, {
        $push: {
          messages: {
            $each: [aiMessageForHistory],
          },
        },
      });
    } else {
      await DocumentChats.findByIdAndUpdate(sessionId, {
        $push: {
          messages: {
            $each: [userMessageForHistory, aiMessageForHistory],
          },
        },
      });
    }

    res.end();

    res.on('close', () => {
      res.end();
    });

    return;
  } catch (error) {
    console.log(error);
    next(error);
  }
};
