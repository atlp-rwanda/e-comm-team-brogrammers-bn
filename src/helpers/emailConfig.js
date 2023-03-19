/* eslint-disable require-jsdoc */
// eslint-disable-next-line import/prefer-default-export
export function emailConfig({ email, subject, content } = {}) {
  return {
    from: process.env.MAIL,
    to: `${email}`,
    subject: `${subject}`,
    html: `${content}`,
  };
}
