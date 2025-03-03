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
    chatName: {
      type: String,
      required: true,
    },
    userId: {type: String, required: true},
    messages: {
      type: [messageSchema],
    },
    document: {
      type: String,
      required: true,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

documentChatSchema.statics = {

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

    const chats = await this.find({ userId }, { document: 0 });

    return chats;
  },

  async getDocumentChatById(sessionId) {
    const chat = await this.findById(sessionId, { document: 0 });
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
