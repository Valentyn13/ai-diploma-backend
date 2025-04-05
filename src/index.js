const {port, env} = require('./config/vars');
const logger = require('./config/logger');
const app = require('./config/express');
var cron = require('node-cron');
const mongoose = require('./config/mongoose');
const {sendBatchMessagesCronJob, retrieveAndProcessAllDataCronJob} = require('./api/utils/sharedCategory/cron.js');
const http = require('http');

mongoose.connect();

http.createServer(app).listen(port, () => {
  if (process.env.NODE_ENV === 'production') {
    logger.info('starting cron jobs in production');

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

  logger.info(`server started on port ${port} (${env} ${process.pid})`);
});
