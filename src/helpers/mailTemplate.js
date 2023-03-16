/* eslint-disable camelcase */
/* eslint-disable arrow-body-style */
/* eslint-disable arrow-spacing */
// eslint-disable-next-line import/prefer-default-export
export const verifyEmailTemplate = (userToken) => {
  return `
    <div style="background-color: #f2f2f2; padding: 20px;">
      <h1 style="color: #004d99; text-align: center;">Welcome to Brogrammers e-commerce!</h1>
      <p style="color: #000; font-size: 16px;">Please click below to activate your account:</p>
      <a href="${process.env.VERIFY_URL}/${userToken}" style="display: block; text-align: center; padding: 10px 20px; background-color: #004d99; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Verify Your Email</a>
      <p style="color: #000; font-size: 14px;">Thank you for choosing Brogrammers e-commerce.</p>
    </div>
    `;
};
export const changePasswordTemplate = (user, passwordExpirationTime) => {
  return `
    <div style="background-color: #f2f2f2; padding: 20px;">
      <h1 style="color: #004d99; text-align: center;">Welcome to Brogrammers e-commerce dear!</h1>
      <p style="color: #000; font-size: 16px;">Dear ${user.username},\n\nYour password will expire in less than ${passwordExpirationTime} minutes.. Please use the following link to change your password:</p>
      <a href="${process.env.FRONTEND_URL}/users/change-password" style="display: block; text-align: center; padding: 10px 20px; background-color: #004d99; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Change Password</a>
      <p style="color: #000; font-size: 14px;">Thank you for choosing Brogrammers e-commerce.</p>
    </div>
    `;
};
export const mfaEmailTemplate = (mfa_code) => {
  return `
  <div style="background-color: #f2f2f2; padding: 20px;">
      <h1 style="color: #004d99; text-align: center;">Please use the following code to login.</h1>
      <p style="color: #000; font-size: 16px;">CODE: ${mfa_code}</p>
      
      <p style="color: #000; font-size: 14px;">Thank you for choosing Brogrammers e-commerce.</p>
    </div>
  `;
};
