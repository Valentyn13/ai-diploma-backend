var admin = require('firebase-admin');
var serviceAccount = require('../../firebase/rega-191cd-firebase-adminsdk-tzvcp-4385138999.json');
const FcmToken = require('../models/fcmToken.model');
const Meditation = require('../models/meditation.model');
const {castToMongoID} = require('../utils/index');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.sendPushNotification = async (req, res, next) => {
  try {
    const arr = await Meditation.find({});
    console.log('arr', arr);
  } catch (error) {
    next(error);
  }
};
