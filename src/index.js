const {port, env} = require('./config/vars');
require('./instrument.js');
const logger = require('./config/logger');
const app = require('./config/express');
var cron = require('node-cron');
const mongoose = require('./config/mongoose');
const cronfun = require('./api/utils/cronJobs');
const {sendBatchMessagesCronJob, retrieveAndProcessAllDataCronJob} = require('./api/utils/sharedCategory/cron.js');
const fs = require('fs');
const https = require('https');
const http = require('http');

mongoose.connect();

const keyPath = '/etc/letsencrypt/live/app.rega-app.com/privkey.pem';
const certPath = '/etc/letsencrypt/live/app.rega-app.com/fullchain.pem';

const checkSSLFiles = () => {
  return fs.existsSync(keyPath) && fs.existsSync(certPath);
};

const sslOptions = checkSSLFiles()
  ? {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    }
  : null;

http.createServer(app).listen(port, () => {
  if (process.env.NODE_ENV === 'production') {
    logger.info('starting cron jobs in production');
    cron.schedule('0 */24 * * *', () => {
      cronfun.sendPushNotificationAfterOneDay();
    });
    cronfun.initializeNotification();

    // Run checks every 30 minutes
    cron.schedule('*/30 * * * *', () => {
      retrieveAndProcessAllDataCronJob();
    });

    // Send batches every day at 3:00 AM
    cron.schedule('0 3 * * *', () => {
      console.log('Executing sendBatchMessagesCronJob at 3:00 AM UTC-0 (5:00 AM UTC+2)');
      logger.info('Executing sendBatchMessagesCronJob at 3:00 AM UTC-0 (5:00 AM UTC+2)');
      sendBatchMessagesCronJob();
    });

    // Send batches every day at 15:00 PM
    cron.schedule('0 15 * * *', () => {
      console.log('Executing sendBatchMessagesCronJob at 15:00 PM UTC-0 (17:00 PM UTC+2)');
      logger.info('Executing sendBatchMessagesCronJob at 15:00 PM UTC-0 (17:00 PM UTC+2)');
      sendBatchMessagesCronJob();
    });
  } else {
    logger.info('skipping crons in dev env (except manual)');
  }
  cron.schedule('0 * * * *', () => {
    cronfun.calculateMeditationChallenge();
  });
  cron.schedule('*/10 * * * *', () => {
    cronfun.sendManualhNotification();
  });

  logger.info(`server started on port ${port} (${env} ${process.pid})`);
});

// If SSL files are found, create HTTPS server
if (checkSSLFiles()) {
  https.createServer(sslOptions, app).listen(8443, () => {
    logger.info('HTTPS server running on port 8443');
  });
} else {
  logger.warn('SSL certificate or key not found. Skipping HTTPS server start.');
}
