const httpStatus = require('http-status');
const User = require('../models/user.model');
const FcmToken = require('../models/fcmToken.model');
const RefreshToken = require('../models/refreshToken.model');
const PasswordResetToken = require('../models/passwordResetToken.model');
const moment = require('moment-timezone');
const {jwtExpirationInterval} = require('../../config/vars');
const APIError = require('../utils/APIError');
const emailProvider = require('../services/emails/emailProvider');
const axios = require('axios');
const logger = require('../../config/logger');

async function addToMailChimp(email) {
  try {
    await axios.get(`https://rega.co.il/api/mailchimp?email=${email}`);
  } catch (e) {
    logger.error(`failed to add email to mailchimp: ${e.toString()}`);
  }
}

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

async function updateFcm(fcmToken, userId) {
  try {
    const findFcm = await FcmToken.find({fcm: fcmToken, userId: userId});

    if (!findFcm || findFcm.length < 1) {
      logger.info(`adding new fcm for user ${userId}: ${fcmToken}`);
      const newfcmToken = new FcmToken({
        userId: userId,
        fcm: fcmToken,
      });
      await newfcmToken.save();
    } else {
      logger.info(`found existing fcm for user ${userId}: ${fcmToken}`);
    }
  } catch (e) {
    logger.error(`failed to update fcm for user ${userId}: ${error.toString()}`);
  }
}
/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const {email, password, name, picture, sex, categories, fcmToken} = req.body;
    logger.info(`register with fcmToken ${fcmToken}`);
    const userData = {
      email,
      password,
      name,
      picture,
      sex,
      userPreferences: {
        selectedCategories: categories,
      },
      userProgress: {},
    };
    const user = await new User(userData).save();
    const userTransformed = user.transform();

    const token = generateTokenResponse(user, user.token());

    await updateFcm(fcmToken, user._id);

    const url = 'https://webhooks.integrately.com/a/webhooks/98862ee6ca0640ddb993e7825a54e0d8';
    await axios.post(url, userTransformed);
    await addToMailChimp(email);

    res.status(httpStatus.CREATED);
    return res.json({token, user: userTransformed});
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const {fcmToken} = req.body;
    logger.info(`login with fcmToken ${fcmToken}`);

    const {user, accessToken} = await User.findAndGenerateToken(req.body);

    const token = generateTokenResponse(user, accessToken);

    await updateFcm(fcmToken, user._id);

    const userTransformed = user.transform();
    return res.json({token, user: userTransformed});
  } catch (error) {
    return next(error);
  }
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    const {user} = req;
    const {fcmToken, email} = req.body;

    await updateFcm(fcmToken, user._id);

    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);

    const userTransformed = user.transform();
    await addToMailChimp(email);
    return res.json({token, user: userTransformed});
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const {email, refreshToken} = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken,
    });
    const {user, accessToken} = await User.findAndGenerateToken({email, refreshObject});
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

exports.sendPasswordReset = async (req, res, next) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email}).exec();

    if (user && email !== 'google@gmail.com') {
      const passwordResetObj = await PasswordResetToken.generate(user);
      emailProvider.sendPasswordReset(passwordResetObj);
      res.status(httpStatus.OK);
      return res.json('success');
    }
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
      message: 'No account found with that email',
    });
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const {email, password, resetToken} = req.body;
    const resetTokenObject = await PasswordResetToken.findOneAndRemove({
      userEmail: email.toLowerCase(),
      resetToken: {$regex: `${resetToken}$`},
    });

    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (!resetTokenObject) {
      err.message = 'Cannot find matching reset token';
      throw new APIError(err);
    }
    if (moment().isAfter(resetTokenObject.expires)) {
      err.message = 'Reset token is expired';
      throw new APIError(err);
    }

    const user = await User.findOne({email: resetTokenObject.userEmail}).exec();
    user.password = password;
    await user.save();
    emailProvider.sendPasswordChangeEmail(user);

    res.status(httpStatus.OK);
    return res.json('Password Updated');
  } catch (error) {
    return next(error);
  }
};
