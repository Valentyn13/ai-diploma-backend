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
    imageUrl: {type: String},
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Notification', notificationSchema);
