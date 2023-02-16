const User = require('../models/user.model');
var admin = require('firebase-admin');
var serviceAccount = require('../../firebase/rega-191cd-firebase-adminsdk-tzvcp-4385138999.json');
const Notification = require('../models/notification.model');
const sendPushNotificationAfterOneDay = async () => {
  try {
    console.log('cron job called');
    const aggregateArray = [
      {
        $addFields: {
          newdate: new Date(),
        },
      },
      {
        $match: {
          'userProgress.minutesPracticed': 0,
          $expr: {
            $lt: [
              {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$createdAt',
                },
              },
              {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$newdate',
                },
              },
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'fcmtokens',
          let: {cId: '$_id'},
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{$eq: ['$userId', '$$cId']}],
                },
              },
            },
          ],
          as: 'notificationsinfo',
        },
      },
      {
        $unwind: '$notificationsinfo',
      },
      {
        $sort: {
          createdAt: 1,
        },
      },

      {
        $project: {
          fcm: '$notificationsinfo.fcm',
          userId: 1,
        },
      },
    ];
    const notificationData = await Notification.findOne({type: 'constant'});
    // console.log('notificationData', notificationData);
    const notificationInfo = await User.aggregate(aggregateArray);
    // console.log('notfication.length', notificationInfo.length);
    for (let i = 0; i != notificationInfo.length; i++) {
      //   console.log('<<<<notificationInfo>>>>>', notificationInfo[i].fcm);
      admin
        .messaging()
        .send({
          token: notificationInfo[i].fcm,
          notification: {body: notificationData.body, title: notificationData.title},
          android: {
            notification: {
              body: notificationData.body,
              title: notificationData.title,
              color: '#fff566',
              priority: 'high',
              sound: 'default',
              vibrateTimingsMillis: [200, 500, 800],
              imageUrl: notificationData.imageUrl,
            },
          },
        })
        .then((msg) => {
          //   console.log('mmmeme', msg);
        });
    }

    // console.log('i am call');
  } catch (error) {
    console.log('error', error);
  }
};

module.exports = {
  sendPushNotificationAfterOneDay,
};
