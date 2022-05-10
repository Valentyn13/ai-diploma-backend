const nodemailer = require('nodemailer');
const {emailConfig} = require('../../../config/vars');
const Email = require('email-templates');
const emailTemplate = require('../../../emailTemplates');

// SMTP is the main transport in Nodemailer for delivering messages.
// SMTP is also the protocol used between almost all email hosts, so its truly universal.
// if you dont want to use SMTP you can create your own transport here
// such as an email service API or nodemailer-sendgrid-transport

const transporter = nodemailer.createTransport({
  port: emailConfig.port,
  host: emailConfig.host,
  auth: {
    user: emailConfig.username,
    pass: emailConfig.password,
  },
  secure: false, // upgrades later with STARTTLS -- change this based on the PORT
});

exports.sendPasswordReset = async (passwordResetObject) => {
  const email = new Email({
    views: {root: __dirname},
    message: {
      from: 'support@your-app.com',
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
        productName: 'Test App',
        // passwordResetUrl should be a URL to your app that displays a view where they
        // can enter a new password along with passing the resetToken in the params
        passwordResetUrl: `https://your-app/new-password/view?resetToken=${passwordResetObject.resetToken}`,
      },
    })
    .catch(() => console.log('error sending password reset email'));
};

exports.sendPasswordChangeEmail = async (user) => {
  const email = new Email({
    views: {root: __dirname},
    message: {
      from: 'support@your-app.com',
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: 'passwordChange',
      message: {
        to: user.email,
      },
      locals: {
        productName: 'Test App',
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
      host: 'smtp.gmail.com',
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
        console.log('error with email connection', error);
      }
    });
    const temp = emailTemplate.DeleteUserDataEmailTemplate(user.name);

    const info = await transport.sendMail({
      from: sender,
      to: 'tom@rega.co.il',
      subject: 'User from Regaapp request',
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
