const httpStatus = require('http-status');
const passport = require('passport');
const User = require('../models/user.model');
const APIError = require('../utils/APIError');
const Axios = require('axios');
const ADMIN = 'admin';
const LOGGED_USER = '_loggedUser';
const LOGGED_USER_NO_ID = '_loggedUserNoId';

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  const error = err || info;
  const logIn = Promise.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });

  try {
    if (error || !user) throw error;
    await logIn(user, {session: false});
  } catch (e) {
    return next(apiError);
  }

  if (roles === LOGGED_USER) {
    if (user.role !== 'admin' && req.params.userId !== user._id.toString()) {
      apiError.status = httpStatus.FORBIDDEN;
      apiError.message = 'Forbidden';
      return next(apiError);
    }
  } else if (roles !== LOGGED_USER_NO_ID && !roles.includes(user.role)) {
    apiError.status = httpStatus.FORBIDDEN;
    apiError.message = 'Forbidden';
    return next(apiError);
  } else if (err || !user) {
    return next(apiError);
  }

  req.user = user;

  return next();
};

exports.ADMIN = ADMIN;
exports.LOGGED_USER = LOGGED_USER;
exports.LOGGED_USER_NO_ID = LOGGED_USER_NO_ID;

exports.authorize = (roles = User.roles) => (req, res, next) =>
  passport.authenticate('jwt', {session: false}, handleJWT(req, res, next, roles))(req, res, next);

exports.oAuth = (service) => passport.authenticate(service, {session: false});

exports.fbAuthenticate = async (req, res, next) => {
  try {
    console.log(' i am calling');
    const {access_token} = req.body;

    var config = {
      method: 'get',
      url: `https://graph.facebook.com/v15.0/me?fields=email%2Cid%2Cfirst_name%2Clast_name&access_token=${access_token}`,
    };
    const response = await Axios(config);
    if (response) {
      const finduser = await User.findOne({email: response.data.email});
      console.log('finduser', finduser);
      if (finduser) {
        req.user = finduser;
        next();
      } else {
        const newData = {
          sex: req.body.sex,
          role: 'user',
          userPreferences: {
            selectedCategories: req.body.categories,
          },
          email: response?.data?.email,
          name: `${response?.data?.first_name}${response?.data?.first_name}`,
          services: {facebook: response?.data?.id},
          password: 'nopass',
        };
        const user = await new User(newData).save();
        req.user = user;
        next();
      }
    }
  } catch (error) {
    const apiError = new APIError({
      message: error ? error.message : 'some thing went wrong',
      status: httpStatus[500],
      stack: error ? error.stack : undefined,
    });
    return next(apiError);
  }
};
