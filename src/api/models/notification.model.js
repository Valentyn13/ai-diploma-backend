const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    test: {
      type: Boolean,
    },
    sent: {
      type: Boolean,
    },
    imageUrl: {type: String},
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Notification', notificationSchema);
