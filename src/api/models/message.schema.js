const mongoose = require('mongoose');
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

module.exports = messageSchema;