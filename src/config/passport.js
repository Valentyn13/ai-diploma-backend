const JwtStrategy = require('passport-jwt').Strategy;
const BearerStrategy = require('passport-http-bearer');
const {ExtractJwt} = require('passport-jwt');
const {jwtSecret} = require('./vars');
const authProviders = require('../api/services/authProviders');
const User = require('../api/models/user.model');
const Axios = require('axios');
const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const jwt = async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

const oAuth = (service) => async (req, token, done) => {
  try {
    // console.log('service', service);
    if (service === 'apple') {
      const {sex, categories, email, sub, name} = req.body;
      const userData = {
        service: 'apple',
        email,
        id: sub,
        name,
      };
      const extendedUserData = {
        ...userData,
        sex,
        categories,
      };
      const user = await User.oAuthLogin(extendedUserData);
      const url = 'https://webhooks.integrately.com/a/webhooks/98862ee6ca0640ddb993e7825a54e0d8';
      await axios.post(url, user);
      return done(null, user);
    }
    const userData = await authProviders[service](token);
    const {sex, categories} = req.body;
    const extendedUserData = {
      ...userData,
      sex,
      categories,
    };
    const user = await User.oAuthLogin(extendedUserData);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

exports.jwt = new JwtStrategy(jwtOptions, jwt);
exports.facebook = new BearerStrategy({passReqToCallback: true}, oAuth('facebook'));
exports.google = new BearerStrategy(oAuth('google'));
exports.apple = new BearerStrategy({passReqToCallback: true}, oAuth('apple'));
