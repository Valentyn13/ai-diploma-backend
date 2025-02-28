const mongoose = require('mongoose');
const httpStatus = require('http-status');

const User = require('./user.model');
const APIError = require('../utils/APIError');
const messageSchema = require('./message.schema');

const documentChatSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {type: String, required: true},
    messages: {
      type: [messageSchema],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

documentChatSchema.statics = {
  async createChat(input, userId) {
    const objectId = new mongoose.Types.ObjectId();
    const stringIdRepresentation = objectId.toString();

    const user = await User.get(userId);


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

  async getUserDocumentChats(userId) {
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
          updatedAt: chat.updatedAt
        };
      }
      return {
        chatId: chat._id,
        firstMessageContent: chat.messages[0].content,
        firstMessageTimestamp: chat.messages[0].timestamp,
        updatedAt: chat.updatedAt
      };
    });

    return normalizedChatsData;
  },

  async getDocumentChatById(sessionId) {
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

module.exports = mongoose.model('DocumentChat', documentChatSchema);
