const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const adminRoutes = require('./admin.route');
const meditationRoutes = require('./meditation.route');
const categoryRoutes = require('./category.route');
const courseRoutes = require('./course.route');
const instructorRoutes = require('./instructor.route');
const revenuecatRoutes = require('./revenuecat.route');
const instructor_tractionData = require('./instructor_tractionData.route.js');
const articleRoutes = require('./article.route');
const chatsRoutes = require('./chats.route');
const insightRoutes = require('./userInsight.route');
const challengeRoutes = require('./meditationChallenge.route.js');
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
router.use('/admin', adminRoutes);
router.use('/meditations', meditationRoutes);
router.use('/categories', categoryRoutes);
router.use('/courses', courseRoutes);
router.use('/instructors', instructorRoutes);
router.use('/revenuecat', revenuecatRoutes);
router.use('/instructor_tractionData', instructor_tractionData);
router.use('/articles', articleRoutes);
router.use('/chats', chatsRoutes);
router.use('/user-insights', insightRoutes);
router.use('/challenge', challengeRoutes);

module.exports = router;
