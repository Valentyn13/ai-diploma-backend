const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');

const chatsRoutes = require('./chats.route');
const insightRoutes = require('./userInsight.route');
const {authorize, LOGGED_USER_NO_ID} = require('../../middlewares/auth.js');
const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));
router.get('/auth-status', authorize(LOGGED_USER_NO_ID), (req, res) => {
  res.status(200).json({status: 'ok'});
});
/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/chats', chatsRoutes);
router.use('/user-insights', insightRoutes);

module.exports = router;
