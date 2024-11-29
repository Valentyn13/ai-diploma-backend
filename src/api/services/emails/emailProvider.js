const nodemailer = require('nodemailer');
const {emailConfig} = require('../../../config/vars');
const Email = require('email-templates');
const emailTemplate = require('../../../emailTemplates');
const logger = require('../../../config/logger');

// SMTP is the main transport in Nodemailer for delivering messages.
// SMTP is also the protocol used between almost all email hosts, so its truly universal.
// if you dont want to use SMTP you can create your own transport here
// such as an email service API or nodemailer-sendgrid-transport

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;
const EMAIL_SENDER = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  port: EMAIL_PORT,
  host: EMAIL_HOST,
  auth: {
    user: EMAIL_SENDER,
    pass: EMAIL_PASSWORD,
  },
  secure: true,
});

exports.sendPasswordReset = async (passwordResetObject) => {
  const email = new Email({
    views: {root: __dirname},
    message: {
      from: `צוות רגע <${emailConfig.from}>`,
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: 'passwordReset',
      message: {
        to: passwordResetObject.userEmail,
      },
      locals: {
        productName: 'רגע',
        name: passwordResetObject.name,
        verificationCode: passwordResetObject.resetToken.substr(passwordResetObject.resetToken.length - 4),
      },
    })
    .catch((e) => logger.error('error sending password reset email', e));
};

exports.sendPasswordChangeEmail = async (user) => {
  const email = new Email({
    views: {root: __dirname},
    message: {
      from: `צוות רגע <${emailConfig.from}>`,
    },
    send: true,
    transport: transporter,
  });

  if (!user.email) {
    return;
  }

  email
    .send({
      template: 'passwordChange',
      message: {
        to: user.email,
      },
      locals: {
        productName: 'רגע',
        name: user.name,
      },
    })
    .catch(() => console.log('error sending change password email'));
};

exports.deleteUserData = async (user) => {
  try {
    const serviceClient = process.env.SERVICE_CLIENT;
    let privateKey = process.env.PRIVATE_KEY;
    privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
    const port = process.env.EMAIL_PORT;
    const sender = process.env.EMAIL_USERNAME;
    const transport = nodemailer.createTransport({
      host: EMAIL_HOST,
      port,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: sender,
        serviceClient,
        privateKey,
      },
    });

    // verify connection configuration
    transport.verify((error) => {
      if (error) {
        logger.error('error with email connection', error);
      }
    });
    const temp = emailTemplate.DeleteUserDataEmailTemplate(user.name);

    const userTemp = emailTemplate.DeleteDataUserTemplate();

    const info = await transport.sendMail({
      from: sender,
      to: 'tom@rega.co.il',
      subject: 'User from Regaapp request',
      html: temp,
    });

    const info2 = await transport.sendMail({
      from: sender,
      to: user.email,
      subject: 'Request for Deleting Data',
      html: userTemp,
    });

    if (info.messageId || info2.messageId) {
      transport.close();
      return true;
    }
    transport.close();
    return false;
  } catch (error) {
    logger.error('Oops! some error occurred on sendEmail(). Error is: ', error);
    return false;
  }
};

exports.cancelSubscription = async (user, reason) => {
  try {
    // const serviceClient = process.env.SERVICE_CLIENT;
    // let privateKey = process.env.PRIVATE_KEY;
    // privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
    // const port = process.env.EMAIL_PORT;
    const sender = process.env.EMAIL_USERNAME;
    const transport = transporter;

    // verify connection configuration
    transport.verify((error) => {
      if (error) {
        logger.error('error with email connection', error);
      }
    });
    const temp = emailTemplate.cancelSubscriptionTemplate(user.name, user._id, user.email, reason);

    const info = await transport.sendMail({
      from: sender,
      to: sender,
      subject: 'User Cancel Subscription',
      html: temp,
    });

    if (info.messageId) {
      transport.close();
      return true;
    }
    transport.close();
    return false;
  } catch (error) {
    console.log('Oops! some error occurred on sendEmail(). Error is: ', error);
    return false;
  }
};
