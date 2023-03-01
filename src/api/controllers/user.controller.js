const httpStatus = require('http-status');
const {omit} = require('lodash');
const User = require('../models/user.model');
const emailProvider = require('../services/emails/emailProvider');
const APIError = require('../utils/APIError');
const bcrypt = require('bcryptjs');
const {env} = require('../../config/vars');

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
    console.log('error', error);
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
    console.log('error', error);
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
    console.log('<<<<<<<error>>>>>>>', error);
    // res.status(httpStatus.BAD_GATEWAY);
    return next(error);
  }
};
