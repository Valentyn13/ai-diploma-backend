const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const adminRoutes = require('./admin.route');
const meditationRoutes = require('./meditation.route');
const categoryRoutes = require('./category.route');
const courseRoutes = require('./course.route');
const instructorRoutes = require('./instructor.route');
const revenuecatRoutes = require('./revenuecat.route');
const notificationRoutes = require('./pushNotification.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

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
router.use('/notification', notificationRoutes);

module.exports = router;
