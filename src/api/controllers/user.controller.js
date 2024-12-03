const httpStatus = require('http-status');
const {omit} = require('lodash');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
const FcmToken = require('../models/fcmToken.model');
var admin = require('firebase-admin');
var serviceAccount = require('../../firebase/old_rega-191cd-firebase-adminsdk-tzvcp-4385138999.json');
const emailProvider = require('../services/emails/emailProvider');
const APIError = require('../utils/APIError');
const cron = require('node-schedule');
const bcrypt = require('bcryptjs');
const {env} = require('../../config/vars');
const logger = require('../../config/logger');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = {user};
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const {user} = req.locals;
    const newUser = new User(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.updateOne(newUserObject, {override: true, upsert: true});
    const savedUser = await User.findById(user._id);

    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.locals.user, updatedUser);

  user
    .save()
    .then((savedUser) => res.json(savedUser.transform()))
    .catch((e) => next(User.checkDuplicateEmail(e)));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const users = await User.list(req.query);
    const transformedUsers = users.map((user) => user.transform());
    res.json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const {user} = req.locals;

  user
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};

exports.syncUserPreferences = (req, res, next) => {
  const userPreferences = req.body;
  const {user} = req.locals;
  user.userPreferences = userPreferences;
  user
    .save()
    .then((savedUser) => res.json(savedUser.transform()))
    .catch((e) => next(e));
};

exports.syncUserProgress = async (req, res, next) => {
  const userProgress = req.body;

  if (userProgress.minutesPracticed > 0) {
    const {user} = req.locals;
    user.userProgress = userProgress;
    user
      .save()
      .then((savedUser) => {
        res.json(savedUser.transform());
      })
      .catch((e) => next(e));
  } else {
    return res.json(user);
  }
};

exports.deleteUserData = async (req, res, next) => {
  try {
    const {user} = req.locals;
    if (user) {
      await emailProvider.deleteUserData(user);
      res.status(httpStatus.OK);
      return res.json('success');
    }
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
      message: 'No account found with that email',
    });
  } catch (error) {
    logger.error(`deleteUserData failed ${error.toString()}`);
    return next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  const {user} = req.locals;
  const response = await User.findOneAndUpdate({_id: user._id}, req.body.data, {
    upsert: true,
    returnNewDocument: true,
    new: true,
  });
  if (response) {
    res.status(httpStatus.OK);
    return res.json(response.transform());
  }
  throw new APIError({
    status: httpStatus.BAD_REQUEST,
    message: 'try later',
  });
};

exports.changePassword = async (req, res, next) => {
  try {
    const obj = req.body;
    const {user} = req.locals;
    const rounds = env === 'test' ? 1 : 10;

    const password = await bcrypt.hash(obj.data, rounds);

    const response = await User.findOneAndUpdate(
      {_id: user._id},
      {password},
      {
        upsert: true,
        returnNewDocument: true,
        new: true,
      },
    );
    if (response) {
      res.status(httpStatus.OK);
      return res.json(response.transform());
    }

    throw new APIError({
      status: httpStatus.BAD_REQUEST,
      message: 'try later',
    });
  } catch (error) {
    logger.error(`changePassword failed: ${error.toString()}`);
    return next(error);
  }
};

exports.sendCancelSubscriptionEmail = async (req, res, next) => {
  try {
    const {user} = req.locals;
    if (user) {
      await emailProvider.cancelSubscription(user, req.body.data.reason);
      res.status(httpStatus.OK);
      return res.json('success');
    }
  } catch (error) {
    // console.log('<<<<<<<error>>>>>>>', error);
    // res.status(httpStatus.BAD_GATEWAY);
    logger.error(`failed to send sendCancelSubscriptionEmail: ${error.toString()}`);
    return next(error);
  }
};

exports.saveNotification = async (req, res, next) => {
  try {
    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount),
    // });
    const {user} = req.locals;
    const {data} = req.body;
    let hour = new Date(data).getHours();
    let mints = new Date(data).getMinutes();

    const findandUpdate = await User.findOneAndUpdate({_id: user._id}, {notificationTime: data, isNotification: true});
    const userId = user._id.toString();

    cron.scheduledJobs[userId] && cron.scheduledJobs[userId].cancel();

    const jobSchedule = `0 ${mints} ${hour} * * *`;

    logger.info(`schedueling job for user ${user._id} at ${jobSchedule}`);

    // schedule cron job for specific user
    cron.scheduleJob(userId, jobSchedule, async () => {
      const {body, title, imageUrl} = await Notification.findOne({type: 'custom'});
      const fetchedTokens = await FcmToken.find({userId: user._id});
      const fcms = fetchedTokens.map(({fcm}) => fcm).filter((fcm) => typeof fcm === 'string');

      await Promise.all[
        fcms.map((token) =>
          admin
            .messaging()
            .send({
              token,
              notification: {body, title},
              android: {
                notification: {
                  body,
                  title,
                  color: '#fff566',
                  priority: 'high',
                  sound: 'default',
                  vibrateTimingsMillis: [200, 500, 800],
                  imageUrl: imageUrl,
                },
              },
            })
            .then((msg) => {
              logger.info(`message sent to ${token}`);
            })
            .catch((err) => {
              logger.error(`failed to send message to ${token}: ${err.toString()}`);
            }),
        )
      ];
    });
  } catch (error) {
    logger.error(`saveNotification failed: ${error.toString()}`);
  }
};

exports.cancelNotification = async (req, res, next) => {
  try {
    const {user} = req.locals;

    await User.findOneAndUpdate({_id: user._id}, {isNotification: false});
  } catch (error) {
    logger.error(`cancelNotification failed: ${error.toString()}`);
  }
};
