const mongoose = require('mongoose');
const httpStatus = require('http-status');

const User = require('./user.model');
const Summary = require('./chatSummary.model');
const APIError = require('../utils/APIError');
const AIModel = require('../../config/llm');

const roles = ['user', 'assistant'];

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: roles,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {type: String, required: true},
    sessionId: {
      type: String,
      required: true,
    },
    summary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Summary',
    },
    messages: {
      type: [messageSchema],
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {versionKey: false},
);

chatSchema.statics = {
  async createChat(input, userId) {
    const objectId = new mongoose.Types.ObjectId();
    const stringIdRepresentation = objectId.toString();

    const modelResponse = await AIModel.createApiCall([], '', input);

    const aiMessage = modelResponse.aiMessage;
    const summary = modelResponse.summary;

    const aiMessageForHistory = AIModel.generateMessageForHistory('assistant', aiMessage);
    const userMessageForHistory = AIModel.generateMessageForHistory('user', input);

    const newSummary = await Summary.create({summary, sessionId: objectId});

    const chat = await this.create({
      _id: objectId,
      sessionId: stringIdRepresentation,
      messages: [userMessageForHistory, aiMessageForHistory],
      userId,
      summary: newSummary._id,
    });
    return chat;
  },

  async deleteChat(sessionId) {
    const chat = await this.findByIdAndDelete(sessionId);
    if (!chat) {
      throw new APIError({
        message: `Chat with id ${sessionId} not found and cannot be deleted`,
        status: httpStatus.NOT_FOUND,
      });
    }
    await Summary.findByIdAndDelete(chat.summary);
    return null;
  },

  async getUserChats(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new APIError({
        message: `User with id ${userId} not found`,
        status: httpStatus.NOT_FOUND,
      });
    }
    const chats = await this.find({userId});

    const normalizedChatsData = chats.map((chat) => {
      return {
        chatId: chat._id,
        firstMessageContent: chat.messages[0].content,
        firstMessageTimestamp: chat.messages[0].timestamp,
      }
    })
    return normalizedChatsData;
  },

  async getChatById(sessionId) {
    const chat = await this.findById(sessionId).populate({
      path: "summary",
    });
    if (!chat) {
      throw new APIError({
        message: `Chat with id ${sessionId} not found`,
        status: httpStatus.NOT_FOUND,
      });
    }
    return chat;
  },
};

module.exports = mongoose.model('Chat', chatSchema);
