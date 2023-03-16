/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-unresolved
import { CronJob } from 'cron';
// eslint-disable-next-line no-unused-vars
import { Op } from 'sequelize';
import sgMail from '@sendgrid/mail';
import moment from 'moment';
import eventEmitter from '../helpers/eventEmitter';
import db from '../database/models';
import { changePasswordTemplate } from '../helpers/mailTemplate';

const passwordExpirationTime = process.env.PASSWORD_EXPIRATION_TIME || 60 * 24;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send password update email
const sendPasswordUpdateEmail = (user) => {
  const emailContent = changePasswordTemplate(user, passwordExpirationTime);
  sgMail.send({
    to: user.email,
    from: process.env.SEND_EMAIL,
    subject: 'Password update required',
    html: emailContent,
  });
};
const hasPasswordExpired = (user) => {
  if (!user.lastTimePasswordUpdated) {
    return true;
  }
  const lastPasswordUpdateTime = moment(user.lastTimePasswordUpdated);
  const passwordExpirationTimeInMs = passwordExpirationTime * 60 * 1000;
  const now = moment();
  return now.diff(lastPasswordUpdateTime, 'milliseconds') > passwordExpirationTimeInMs;
};

const updateUserMustUpdatePasswordField = (user, mustUpdatePassword) => {
  user.mustUpdatePassword = mustUpdatePassword;
  user.save();
};

const promptPasswordUpdate = (user) => {
  updateUserMustUpdatePasswordField(user, true);
};

// eslint-disable-next-line arrow-body-style
const hasUserIgnoredPasswordUpdatePrompt = (user) => {
  return user.mustUpdatePassword === true && hasPasswordExpired(user);
};

const checkPasswordExpirationCronJob = new CronJob(process.env.CRON, async (req, res) => {
  try {
    const usersk = await db.users.findAll();

    usersk.forEach(async (user) => {
      if (hasPasswordExpired(user)) {
        sendPasswordUpdateEmail(user);

        promptPasswordUpdate(user);
      } else if (hasUserIgnoredPasswordUpdatePrompt(user)) {
        updateUserMustUpdatePasswordField(user, false);
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: 'Error checking password expiration',
    });
  }
});

// Start the cron job
checkPasswordExpirationCronJob.start();

eventEmitter.on('passwordUpdated', (user) => {
  updateUserMustUpdatePasswordField(user, false);
});

export default checkPasswordExpirationCronJob;
