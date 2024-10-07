// make bluebird default Promise
// Promise = require('bluebird'); // eslint-disable-line no-global-assign
const {port, env} = require('./config/vars');
const logger = require('./config/logger');
const app = require('./config/express');
var cron = require('node-cron');
const mongoose = require('./config/mongoose');
const cronfun = require('./api/utils/cronJobs');
// open mongoose connection

mongoose.connect();

// listen to requests
app.listen(port, () => {
  if (process.env.NODE_ENV === 'production') {
    logger.info('starting cron jobs in production');
    cron.schedule('0 */24 * * *', () => {
      cronfun.sendPushNotificationAfterOneDay();
    });
    cronfun.initializeNotification();  
  } else {
    logger.info('skipping crons in dev env (except manual)');
  }
  cron.schedule('*/10 * * * *', () => {
    cronfun.sendManualhNotification();
  });
  logger.info(`server started on port ${port} (${env} ${process.pid})`);
});

// task.start();
/**
 * Exports express
 * @public
 */
module.exports = app;
