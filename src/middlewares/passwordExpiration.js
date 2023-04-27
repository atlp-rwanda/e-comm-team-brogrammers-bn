/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-unresolved
import { CronJob } from 'cron';
import moment from 'moment';
import eventEmitter from '../helpers/eventEmitter';
import db from '../database/models';
import { changePasswordTemplate, expiredPasswordTemplate } from '../helpers/mailTemplate';
import { emailConfig } from '../helpers/emailConfig';
import { sendEmail } from '../helpers/mail';

const passwordExpirationTime = process.env.PASSWORD_EXPIRATION_TIME || 60 * 24;

const sendPasswordUpdateEmail = (user) => {
  const emailContent = changePasswordTemplate(user, passwordExpirationTime);
  sendEmail(
    emailConfig({
      email: user.email,
      subject: 'Password update required',
      content: emailContent,
    })
  );
};
const sendPasswordExpredEmail = (user) => {
  const emailContents = expiredPasswordTemplate(user);
  sendEmail(
    emailConfig({
      email: user.email,
      subject: 'Your Password has Expired',
      content: emailContents,
    })
  );
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
  if (hasPasswordExpired(user)) {
    sendPasswordExpredEmail(user);
  } else {
    sendPasswordUpdateEmail(user);
  }
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

eventEmitter.on('passwordUpdated', (user) => {
  updateUserMustUpdatePasswordField(user, false);
});

export default checkPasswordExpirationCronJob;
