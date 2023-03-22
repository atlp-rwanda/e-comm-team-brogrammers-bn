/* eslint-disable import/prefer-default-export */
/* eslint-disable require-jsdoc */
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-named-as-default-member
import User from '../services/user.services';

export const sendEmail = (mailConfigurations) => {
  const msg = {
    to: mailConfigurations.to,
    from: mailConfigurations.from,
    subject: mailConfigurations.subject,
    html: mailConfigurations.html,
  };
  if (process.env.NODE_ENV !== 'test') {
    User.sendMailWithNodemailer({
      email: msg.to,
      subject: msg.subject,
      content: msg.html,
    });
  }
  return true;
};
