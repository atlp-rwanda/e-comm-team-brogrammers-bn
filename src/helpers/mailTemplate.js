/* eslint-disable camelcase */
/* eslint-disable arrow-body-style */
/* eslint-disable arrow-spacing */
import moment from 'moment';

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
</div>`;
};

export const passwordResetEmailTemplate = (resetToken) => {
  return `
    <div style="background-color: #f2f2f2; padding: 20px;">
      <h1 style="color: #004d99; text-align: center;">Brogrammers e-commerce!</h1>
      <p style="color: #000; font-size: 16px;">Please click below to reset you password</p>
      <form action="${process.env.PASSWORD_RESET_URL}/${resetToken}" method="POST">
      <button href="" style="display: block; text-align: center; padding: 10px 20px; background-color: #004d99; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Reset Your Password</button>
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
export const disableEmailTemplate = (username, disabledReason) => {
  return `
  <div style="background-color: #f2f2f2; padding: 20px;">
      <h1 style="color: #004d99; text-align: center;">Dear ${username},<br/></h1>
      <p style="color: #000; font-size: 16px;">Your account has been disabled due to the following reason(s):<br/><br/>
      ${disabledReason}<br/><br/>Please contact the support team if you have any questions.<br/><br/><br/>Best regards, <br/><br/>The support team,</p>

      <p style="color: #000; font-size: 14px;">Thank you for choosing Brogrammers e-commerce.</p>
    </div>
  `;
};

export const expireProduct = (user, product) => {
  return (`
  <div style="width:100%; font-family: sans-serif, system-ui;">
    <h1 style="text-align:center;background-color: #222;color: #fff;padding: 1.5rem;">
      ⚠️ Important: ${product.name} has Expired
    </h1>
    <div style="padding: 0 1rem;">
    <p>Dear ${user.username},</p>
      <p>
        I hope this email finds you well. We are writing to notify you that one of the products you 
        have listed on our market is had expired. We take the quality and safety of our products 
        very seriously, and it is important to us that our customers receive products that are fresh and effective.
      </p>
      <p>
        Please take necessary actions to ensure that the product is either removed from the market 
        or the expiry date is updated. We understand that mistakes can happen, and we appreciate 
        your cooperation in resolving this issue.
      </p>
      <div style="display: flex; align-items: center;">
        <img src="${product.images[0]}" style="width: 30%"/>
        <div style="padding-left: 1rem;">
          <p>name: <b>${product.name}</b></p>
          <p>price: <b>US$${product.price}</b></p>
          <p>quantity: <b>${product.quantity}</b></p>
          <p>expires: <b>${product.exp_date}</b></p>
        </div>
      </div>
      <p>
        If you need any assistance in this matter or have any questions, please do not hesitate to 
        contact us. We look forward to continuing to work with you and providing our customers with 
        high-quality products.
      </p>
      <p>Best regards,</p>
    </div>
  </div>
  `);
};

export const expireProductWarning = (user, product) => {
  return (`
    <div style="width:100%; font-family: sans-serif, system-ui;">
      <h1 style="text-align:center;background-color: #222;color: #fff;padding: 1.5rem;">
        ⚠️ Reminder: Expiry Date of ${product.name} is Approaching
      </h1>
      <div style="padding: 0 1rem;">
      <p>Dear ${user.username},</p>
        <p>
          I hope this email finds you well. We are writing to notify you that one of the products you 
          have listed on our market is about to expire. We take the quality and safety of our products 
          very seriously, and it is important to us that our customers receive products that are fresh and effective.
        </p>
        <p>
          Please take necessary actions to ensure that the product is either removed from the market 
          or the expiry date is updated. We understand that mistakes can happen, and we appreciate 
          your cooperation in resolving this issue.
        </p>
        <div style="display: flex; align-items: center;">
          <img src="${product.images[0]}" style="width: 30%"/>
          <div style="padding-left: 1rem;">
            <p>name: <b>${product.name}</b></p>
            <p>price: <b>US$${product.price}</b></p>
            <p>quantity: <b>${product.quantity}</b></p>
            <p>expires: <b>${moment(product.exp_date).fromNow()}</b></p>
          </div>
        </div>
        <p>
          If you need any assistance in this matter or have any questions, please do not hesitate to 
          contact us. We look forward to continuing to work with you and providing our customers with 
          high-quality products.
        </p>
        <p>Best regards,</p>
      </div>
    </div>
  `);
};

export const notificationTemplate = (username, message, type, url)=>{
  return ` <div style="width:100%; font-family: sans-serif, system-ui;">
  <h1 style="text-align:center;background-color: #f2f2f2;color: ;padding: 1.5rem;">
    !!${type}
  </h1>
  <div style="padding: 0 1rem;">
  <h3>Dear ${username},</h3>
    <h3>
      I hope this email finds you well, email if for follow up about your showed interest in before, so this to notify you that  ${message} 
    </h3>
<div style="text-align:left;">
    <button style="text-align:center;background-color: #004d99;color: #fff;padding: 1.2rem;width:50%;color:black; margin-top:50px;border:none "><a href =${url} style="text-decoration:none;color:black ;font-size: 23px;"> view here</a> </button>,
  </div>
    <p>Best regards, form Brogrammers</p>
  </div>
</div>`;
};
