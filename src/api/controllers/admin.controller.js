const httpStatus = require('http-status');
const Category = require('../models/category.model');
const Meditation = require('../models/meditation.model');
const Course = require('../models/course.model');
const Instructor = require('../models/instructor.model');
const User = require('../models/user.model');
const FcmToken = require('../models/fcmToken.model');
const logger = require('../../config/logger');
var admin = require('firebase-admin');

exports.initSchema = async (req, res, next) => {
  try {
    const createdModels = {};

    const {deleteOnly} = req.body;

    await Category.deleteMany({});
    await Instructor.deleteMany({});
    await Meditation.deleteMany({});
    await Course.deleteMany({});

    if (deleteOnly) {
      res.status(httpStatus.OK);
      res.json({status: 'all collections deleted'});
      return;
    }

    // const notification = new Notification();
    // notification.type = 'custom';
    // notification.title = 'welcome';
    // notification.body = 'welcome to Rega app ';
    // notification.imageUrl = "https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/react-128.png'";
    // const savenoti = await notification.save();
    // createdModels.notifications = [savenoti];
    // Instructors

    const instructor = new Instructor();
    instructor.name = 'דנה מאיר';
    instructor.info = 'דנה מאיר היא מורת מדיטציה ופסיכולוגית בשרות משרד החינוך';
    const savedInstructor = await instructor.save();
    createdModels.instructors = [savedInstructor];

    // Meditations

    const meditation1 = new Meditation();
    meditation1.name = 'שינה יותר טובה';
    meditation1.url = 'https://www.avihay.net/wp-content/uploads/2017/12/hebcorazon.mp3';
    meditation1.instructor = instructor.id;
    meditation1.duration = 200;
    const savedMeditation1 = await meditation1.save();

    const meditation2 = new Meditation();
    meditation2.name = 'לפני אימון';
    meditation2.url = 'https://www.avihay.net/wp-content/uploads/2017/12/hebcorazon.mp3';
    meditation2.instructor = instructor.id;
    meditation2.duration = 400;
    const savedMeditation2 = await meditation2.save();

    const meditation3 = new Meditation();
    meditation3.name = 'איך נושמים';
    meditation3.url = 'https://www.avihay.net/wp-content/uploads/2017/12/hebcorazon.mp3';
    meditation3.duration = 315;

    const savedMeditation3 = await meditation3.save();

    createdModels.meditations = [savedMeditation1, savedMeditation2, savedMeditation3];

    // Categories

    const category1 = new Category();
    category1.name = 'sleep';
    category1.title = 'שינה';
    category1.info = 'משפט או שניים המסבירים על הקטגוריה. צריך להיות מושך ולא מאיים. וגם בלה בלה';
    category1.meditations = [meditation1.id];
    const savedCategory1 = await category1.save();

    const category2 = new Category();
    category2.name = 'army';
    category2.title = 'צבא';
    category2.info = 'משפט או שניים המסבירים על הקטגוריה. צריך להיות מושך ולא מאיים. וגם בלה בלה';
    category2.meditations = [meditation2.id];
    const savedCategory2 = await category2.save();

    createdModels.categories = [savedCategory1, savedCategory2];

    // Courses

    const course = new Course();
    course.instructor = instructor.id;
    course.name = 'קורס ראשון';
    course.info =
      "אי אפשר להתעלם מהיתרונות הרבים של לימוד מדיטציה בקבוצה, במסגרת קורס, סדנה, 'ריטריט' (Retreat) או מפגשי תרגול קבועים, אך לימוד מדיטציה אחד על אחד עם מורה למדיטציה מכיל תועלות חשובות ויוצאות דופן.ציה בקבוצה, במסגרת קורס, סדנה, 'ריטריט' (Retreat) או מפגשי תרגול קבועים, אך לימוד מדיטציה אחד על אחד עם מורה למדיטציה מכיל תועלות חשובות ויוצאות דופן. ציה בקבוצה, במסגרת קורס, סדנה, ריטריט (Retreat) או מפגשי תרגול קבועים, אך לימוד מדיטציה אחד על אחד עם מורה למדיטציה מכיל תועלות חשובות ויוצאות דופן.";
    course.meditations = [meditation3.id];
    const savedCourse = await course.save();
    createdModels.courses = [savedCourse];

    res.status(httpStatus.CREATED);
    res.json(createdModels);
  } catch (error) {
    next(error);
  }
};

exports.sendTestNotification = async (req, res, next) => {
  try {
    const {id} = req.body;

    const user = await User.findOne({_id: id});

    if (user) {

      const fcmTokens = await FcmToken.find({userId: user._id});

      logger.info(`found ${fcmTokens.length} fcmTokens for user ${id}`);

      const messages = fcmTokens.map((fcmToken) => ({
        token: fcmToken.fcm,
        notification: {body: 'test notification', title: 'test notification'},
        android: {
          notification: {
            body: 'test notification',
            title: 'test notifiation',
            color: '#fff566',
            priority: 'high',
            sound: 'default',
            vibrateTimingsMillis: [200, 500, 800],
            // imageUrl: notificationData.imageUrl,
          },
        },
      }));

      admin
      .messaging()
      .sendAll(messages)
      .then((sendRes) => {
        logger.info(`sendAll response for fcmToken ${JSON.stringify(fcmTokens.map(({fcm}) => fcm))}: ${JSON.stringify(sendRes)}`);
      }).catch((err) => {
        logger.info(`sendAll failed with err: ${err.toString()}`);
      });

    } else {
      logger.info(`did not find user by id, ignoring sendTestNotification request`);
    }
    
    res.json();

  } catch (error) {
    logger.error(`saveNotification failed: ${error.toString()}`);
    next(error);
  }
};