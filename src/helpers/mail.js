/* eslint-disable import/prefer-default-export */
/* eslint-disable require-jsdoc */
// eslint-disable-next-line import/no-extraneous-dependencies
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = (mailConfigurations) => {
  const msg = {
    to: mailConfigurations.to,
    from: mailConfigurations.from,
    subject: mailConfigurations.subject,
    html: mailConfigurations.html,
  };
  sgMail.send(msg);
  return true;
};
