// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
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
  cron.schedule('0 */12 * * *', () => {
    // console.log('i am crone ');
    cronfun.sendPushNotificationAfterOneDay();
  });
  cronfun.initializeNotification();
  logger.info(`server started on port ${port} (${env} ${process.pid})`);
});

// task.start();
/**
 * Exports express
 * @public
 */
module.exports = app;
