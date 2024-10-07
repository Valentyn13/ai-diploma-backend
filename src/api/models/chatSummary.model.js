const mongoose = require('mongoose');

const chatSummary = new mongoose.Schema({
  summary: {
    type: String,
    required: true,
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});


module.exports = mongoose.model('Summary', chatSummary);