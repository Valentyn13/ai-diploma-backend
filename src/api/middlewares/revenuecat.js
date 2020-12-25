const httpStatus = require('http-status');
const {revenueCatSecret} = require('../../config/vars');
const APIError = require('../utils/APIError');

function isAuthorized(req) {
  // Check authorization header
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return false;
  }
  const authToken = req.headers.authorization.split('Bearer ')[1];
  if (authToken !== revenueCatSecret) {
    return false;
  }

  return true;
}

async function authenticateRevenueCat(req, res, next) {
  if (!isAuthorized(req)) {
    const apiError = new APIError({
      message: 'Unauthorized',
      status: httpStatus.UNAUTHORIZED,
    });
    return next(apiError);
  }

  return next();
}

module.exports = authenticateRevenueCat;
