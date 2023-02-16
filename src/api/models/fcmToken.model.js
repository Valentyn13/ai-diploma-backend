const mongoose = require('mongoose');
const fcmTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fcm: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('FcmToken', fcmTokenSchema);
