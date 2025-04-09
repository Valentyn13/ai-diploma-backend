const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const routes = require('../api/routes/v1');
const {logs} = require('./vars');
const strategies = require('./passport');
const logger = require('../config/logger');
const error = require('../api/middlewares/error');
const userInsightQuestion = require('../api/models/userInsightQuestion.model');

/**
 * Express instance
 * @public
 */
const app = express();

// request logging. dev: console | production: file
app.use(morgan(logs, {stream: logger.stream}));

// parse body params and attache them to req.body
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable authentication
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);
app.post('/', async (req, res) => {
  try {
    const {question} = req.body;
    const a = await userInsightQuestion.create({
      question,
    });

    res.status(200).json({
      message: 'ok',
      data: a,
    });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({
      message: 'error',
    });
  }
});
// mount api v1 routes
app.use('/v1', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
