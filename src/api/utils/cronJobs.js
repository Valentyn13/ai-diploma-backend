const User = require('../models/user.model');
var admin = require('firebase-admin');
const cron = require('node-schedule');
var serviceAccount = require('../../firebase/rega-191cd-firebase-adminsdk-tzvcp-4385138999.json');
const Notification = require('../models/notification.model');
const logger = require('../../config/logger');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const sendPushNotificationAfterOneDay = async () => {
  try {
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
    for (let i = 0; i !== notificationInfo.length; i++) {
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
          logger.log('message sent', {fcm: notificationInfo[i].fcm, msg});
        }).catch((err) => {
          logger.error('failed to send message', err);
        });
    }
  } catch (error) {
    logger.error('sendPushNotificationAfterOneDay failed', error);
  }
};

const initializeNotification = async () => {
  try {
    const aggregateArray = [
      {
        $match: {
          isNotification: true,
        },
      },
      {
        $lookup: {
          from: 'fcmtokens',
          localField: '_id',
          foreignField: 'userId',
          as: 'notificationInfo',
        },
      },
      {
        $unwind: '$notificationInfo',
      },
      {
        $project: {
          fcmtoken: '$notificationInfo.fcm',
          isNotification: 1,
          notificationTime: 1,
          userId: '$_id',
          name: 1,
        },
      },
    ];

    const notificationData = await Notification.findOne({type: 'custom'});
    const userNotificationinfo = await User.aggregate(aggregateArray);
    for (let i = 0; i !== userNotificationinfo.length; i++) {
      let userId = userNotificationinfo[i].userId.toString();
      cron.scheduledJobs[userId] && cron.scheduledJobs[userId].cancel();
     
      let hour = new Date(userNotificationinfo[i].notificationTime).getHours();
      let mints = new Date(userNotificationinfo[i].notificationTime).getMinutes();
      const jobSchedule = `0 ${mints} ${hour} * * *`;
      // schedule cron job for each user
      cron.scheduleJob(userId, jobSchedule, () => {
        admin
          .messaging()
          .send({
            token: userNotificationinfo[i].fcmtoken,
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
            logger.log('message sent', {fcm: userNotificationinfo[i].fcmtoken, msg});
          }).catch((err) => {
            logger.error('failed to send message', err);
          });
      });
    }
  } catch (error) {
    logger.error('initializeNotification failed', error);
  }
};

const sendManualhNotification = async () => {
  try {
    const aggregateArray = (testNotification) => ([
      // {
      //   $addFields: {
      //     currDate: new Date(),
      //   },
      // },
      {
        $match: {
          ...(testNotification ? {'manualNotificationTester': true} : {}),
        },
      },
      {
        $lookup: {
          from: 'fcmtokens',
          localField: '_id',
          foreignField: 'userId',
          as: 'notificationInfo',
        },
      },
      {
        $unwind: '$notificationInfo',
      },
      {
        $project: {
          fcmtoken: '$notificationInfo.fcm',
          isNotification: 1,
          notificationTime: 1,
          userId: '$_id',
          name: 1,
        },
      },
    ]);

    let currentDate = new Date().toISOString();

    const notificationData = await Notification.findOneAndUpdate({type: 'manual', sent: false, sendAt: { $lte: currentDate }}, {sent: true});

    if (notificationData != null) {
      
      const userNotificationInfo = await User.aggregate(aggregateArray(notificationData.test));  

      console.log(`${currentDate} - sending manual notification to ${(notificationData.test ? 'TEST' : 'ALL')} users (#${userNotificationInfo.length} devices)`);

      for (let i = 0; i !== userNotificationInfo.length; i++) {
        // console.log('<<<<notificationInfo>>>>>', userNotificationInfo[i].fcmtoken);
        admin
          .messaging()
          .send({
            token: userNotificationInfo[i].fcmtoken,
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
            logger.log('message sent', {fcm: userNotificationInfo[i].fcmtoken, msg});
          }).catch((err) => {
            logger.error('failed to send message', err);
          }) 
      }

    } else {
      logger.log(`${currentDate} - no manual notifications found`);
    }

  } catch (error) {
    logger.error('sendManualhNotification failed', error);
  }
};

module.exports = {
  sendPushNotificationAfterOneDay,
  initializeNotification,
  sendManualhNotification,
};
