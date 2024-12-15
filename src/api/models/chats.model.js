const mongoose = require('mongoose');
const httpStatus = require('http-status');

const User = require('./user.model');
const APIError = require('../utils/APIError');
const {createApiCall} = require('../../config/llm/api');
const {generateMessageForHistory} = require('../../config/llm/helpers');
const {CHAT_CATEGORIES} = require('../../constants/chatCategories');
const ROLES = ['user', 'assistant'];

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ROLES,
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
    lastCachedMessageIndex: {
      type: Number,
      default: 0,
    },
    startCacheMessageIndex: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: CHAT_CATEGORIES,
    },
    messages: {
      type: [messageSchema],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

chatSchema.statics = {
  async createChat(input, userId) {
    const objectId = new mongoose.Types.ObjectId();
    const stringIdRepresentation = objectId.toString();

    const user = await User.get(userId);

    const userData = {
      name: user.name,
      gender: user.sex,
    };

    const modelResponse = await createApiCall(userData, [], 0, 0, input);

    const aiMessage = modelResponse.aiMessage;

    const aiMessageForHistory = generateMessageForHistory('assistant', aiMessage);
    const userMessageForHistory = generateMessageForHistory('user', input);

    const chat = await this.create({
      _id: objectId,
      sessionId: stringIdRepresentation,
      messages: [userMessageForHistory, aiMessageForHistory],
      userId,
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

    return chat;
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
      if (chat.category) {
        return {
          chatId: chat._id,
          firstMessageContent: chat.messages[0].content,
          firstMessageTimestamp: chat.messages[0].timestamp,
          category: chat.category,
        };
      }
      return {
        chatId: chat._id,
        firstMessageContent: chat.messages[0].content,
        firstMessageTimestamp: chat.messages[0].timestamp,
      };
    });

    return normalizedChatsData;
  },

  async getChatById(sessionId) {
    const chat = await this.findById(sessionId);
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
