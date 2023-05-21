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
    const notificationInfo = await User.aggregate(aggregateArray);

    for (let i = 0; i !== notificationInfo.length; i++) {
      
      logger.info(`sending constant notifiation to new user with fcm ${notificationInfo[i].fcm}`);
      
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
          logger.info(`message sent to ${notificationInfo[i].fcm}`);
        }).catch((err) => {
          logger.error(`failed to send message to fcm ${notificationInfo[i].fcm}: ${err.toString()}`);
        });
    }
  } catch (error) {
    logger.error(`sendPushNotificationAfterOneDay failed: ${error.toString}`);
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
    const userNotificationInfo = await User.aggregate(aggregateArray);

    for (let i = 0; i !== userNotificationInfo.length; i++) {

      let userId = userNotificationInfo[i].userId.toString();
      cron.scheduledJobs[userId] && cron.scheduledJobs[userId].cancel();
     
      let hour = new Date(userNotificationInfo[i].notificationTime).getHours();
      let mints = new Date(userNotificationInfo[i].notificationTime).getMinutes();
      const jobSchedule = `0 ${mints} ${hour} * * *`;
      
      logger.info(`initializing cron job for user ${userId} scheduled at ${jobSchedule} with fcm token ${userNotificationInfo[i].fcmtoken}`);

      // schedule cron job for each user
      cron.scheduleJob(userId, jobSchedule, () => {

        logger.info(`sending user notificaion to user ${userId} with fcm token ${userNotificationInfo[i].fcmtoken}`);
        
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
            logger.info(`message sent to ${userNotificationInfo[i].fcmtoken}`);
          }).catch((err) => {
            logger.error(`failed to send message to ${userNotificationInfo[i].fcmtoken}: ${err.toString()}`);
          });
      });
    }
  } catch (error) {
    logger.error(`initializeNotification failed ${error.toString()}`);
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

    let currentDate = new Date();

    const notificationData = await Notification.findOneAndUpdate({type: 'manual', sent: false, sendAt: { $lte: currentDate }}, {sent: true});

    if (notificationData != null) {
      
      const userNotificationInfo = await User.aggregate(aggregateArray(notificationData.test));  

      logger.info(`${currentDate.toString()} - sending manual notification to ${(notificationData.test ? 'TEST' : 'ALL')} users (#${userNotificationInfo.length} devices)`);

      for (let i = 0; i !== userNotificationInfo.length; i++) {

        logger.info(`sending manual notificaion to ${userNotificationInfo[i].fcmtoken}`);

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
            logger.info(`message sent to ${userNotificationInfo[i].fcmtoken}`);
          }).catch((err) => {
            logger.error(`failed to send message to fcmToken ${userNotificationInfo[i].fcmtoken}: ${err.toString()}`);
          }) 
      }
    } else {
      logger.info(`${currentDate} - no manual notifications found`);
    }

  } catch (error) {
    logger.error(`sendManualhNotification failed: ${error.toString()}`);
  }
};

module.exports = {
  sendPushNotificationAfterOneDay,
  initializeNotification,
  sendManualhNotification,
};
