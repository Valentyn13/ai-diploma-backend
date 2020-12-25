const User = require('../models/user.model');

/**
 * Post RevenueCat Events
 * @public
 */
exports.webhook = async (req, res, next) => {
  try {
    res.send('OK');
  } catch (error) {
    next(error);
  }
};
