const winston = require('winston');

const logFormat = winston.format.printf((info) => {
  const formattedDate = info.timestamp.replace('T', ' ').replace('Z', '');
  return `${formattedDate} - Rega - ${info.level} - ${info.message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    // winston.format.json()
    logFormat,
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    // new winston.transports.File({filename: 'error.log', level: 'error'}),
    // new winston.transports.File({filename: 'combined.log'}),
    new winston.transports.File({
      // format: winston.format.simple(),
      level: 'info',
      filename: './logs/all-logs.log',
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      // colorize: false,
      // json: true,
    }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
