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
export const verifyEmailSubscriberTemplate = (userToken, token) => {
  return `
  <div style="background-color: #f2f2f2; padding: 20px;">
    <h1 style="color: #004d99; text-align: center;">Thank you for subscribing to Brogrammers e-commerce newsletter!</h1>
    <p style="color: #000; font-size: 16px;">Please click below to confirm your subscription:</p>
   <a href="${process.env.SWAGGER_SERVER}/subscriber/verify/${userToken}?r=${token}" style="display: block; text-align: center; padding: 10px 20px; background-color: #004d99; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Confirm Subscription</a>
   <p style="color: #000; font-size: 14px;">You will now receive our latest updates and promotions.</p>
  </div>
    `;
};
export const thankYouSubscriberTemplate = (username, subscriberId) => {
  return `
    <div style="background-color: #f2f2f2; padding: 20px;">
      <h1 style="color: #004d99; text-align: center;">Thank you ${username} for subscribing to Brogrammers e-commerce newsletter!</h1>
      <p style="color: #000; font-size: 16px;">You will now receive our latest updates and promotions.</p>
      <p style="color: #000; font-size: 14px;">If you would like to unsubscribe from our newsletter, please click <a href="${process.env.UNSUBSCRIBE_URL}/${subscriberId}" style="color: #004d99; text-decoration: underline;">here</a>.</p>
    </div>
  `;
};
export const changePasswordTemplate = (user, passwordExpirationTime) => {
  return `
    <div style="background-color: #f2f2f2; padding: 20px;">
      <h1 style="color: #004d99; text-align: center;">Welcome to Brogrammers e-commerce dear!</h1>
      <p style="color: #000; font-size: 16px;">Dear ${user.username},\n\nYour password will expire in less than ${passwordExpirationTime} minutes.. Please use the following link to change your password:</p>
      <a href="${process.env.FRONTEND_URL}/change-password" style="display: block; text-align: center; padding: 10px 20px; background-color: #004d99; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Change Password</a>
</div>`;
};
export const expiredPasswordTemplate = (user) => {
  return `
    <div style="background-color: #f2f2f2; padding: 20px;">
    <h1 style="color: #004d99; text-align: center;">Brogrammers e-commerce Password Expired Notification</h1>
      <p style="color: #000; font-size: 16px;">Dear ${user.username},</p>
      <p style="color: #000; font-size: 16px;">Your password for Brogrammers e-commerce has expired. Please change your password immediately to ensure the security of your account.</p>
      <a href="${process.env.FRONTEND_URL}/change-password" style="display: block; text-align: center; padding: 10px 20px; background-color: #004d99; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Change Password</a>
    </div>`;
};

export const passwordResetEmailTemplate = (resetToken) => {
  return `
    <div style="background-color: #f2f2f2; padding: 20px;">
      <h1 style="color: #004d99; text-align: center;">Brogrammers e-commerce!</h1>
      <p style="color: #000; font-size: 16px;">Please click below to reset you password</p>
      <a target="_blank" href="${process.env.PASSWORD_RESET_URL}/${resetToken}" style="display: block; text-align: center; font-size:18px; padding: 10px 20px; background-color: #004d99; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;"> Click to reset your password</a>
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

export const paymentComplete = (user, products) => {
  return (`
    <div style="width:100%; font-family: sans-serif, system-ui;">
      <h1 style="text-align:center;background-color: #222;color: #fff;padding: 1.5rem;">
      ${user.username}, Thank you for purchasing our products!
      </h1>
      <div style="padding: 0 1rem;">
      <p>Dear ${user.username},</p>
        <p>
          I wanted to take a moment to thank you for choosing our product. We hope you're enjoying it 
          and finding it useful. Your support means a lot to us as a small business, and we're so 
          grateful for your purchase.
        </p>
        ${products.map((product) => (`
          <div style="display: flex; align-items: center;">
            <img src="${product.images[0]}" style="max-width: 30%;height: 7rem;object-fit: cover;"/>
            <div style="padding-left: 1rem;">
              <p>name: <b>${product.name}</b></p>
              <p>price: <b>US$${product.price}</b></p>
              <p>quantity: <b>${product.orderitem.quantity}</b></p>
            </div>
          </div>
        `))}
        <p>
          If you have any questions or feedback, please don't hesitate to reach out. We're always 
          looking for ways to improve our products and make them even more valuable for our customers.
        </p>
        <p>Best regards,</p>
      </div>
    </div>
  `);
};

export const paymentEmail = (user, products, url) => {
  return (`
    <div style="width:100%; font-family: sans-serif, system-ui;">
      <h1 style="text-align:center;background-color: #222;color: #fff;padding: 1.5rem;">
      ${user.username}, Thanks for your interest in our products!
      </h1>
      <div style="padding: 0 1rem;">
      <p>Dear ${user.username},</p>
        <p>
          Thank you for reaching out to us about our products. We're excited to hear that you're 
          interested in purchasing one, and we're happy to provide you with any information you 
          need to help you make a decision.
        </p>
        <p>
          <a href="${url}">
            <button style="color:#222;background-color:#fa0; padding: 1.5rem 3rem;border: none;border-radius: 5px;">Pay here</button>
          </a>
        </p>
        ${products.map((product) => (`
          <div style="display: flex; align-items: center;">
            <img src="${product.images[0]}" style="max-width: 30%;height: 7rem;object-fit: cover;"/>
            <div style="padding-left: 1rem;">
              <p>name: <b>${product.name}</b></p>
              <p>price: <b>US$${product.price}</b></p>
              <p>quantity: <b>${product.orderitem.quantity}</b></p>
            </div>
          </div>
        `))}
        <p>
          If you have any questions about our product or would like more information, please feel free 
          to ask. We're happy to provide you with additional details or specifications to help you make 
          an informed decision.
        </p>
        <p>
          <a href="${url}">
            <button style="color:#222;background-color:#fa0; padding: 1.5rem 3rem;border: none;border-radius: 5px;">Pay here</button>
          </a>
        </p>
        <p>
          Thank you again for considering our product. We look forward to hearing back from you soon!
        </p>
        <p>Best regards,</p>
      </div>
    </div>
  `);
};
export const notificationTemplate = (username, message, type, url)=>{
  return `  <div style="width:100%;hight:50%; background-color:#f2f2f2; font-family: sans-serif, system-ui;color:black;">
  <div style="width:100%; font-family: sans-serif, system-ui;">
    <h1 style="text-align:center;background-color: #f2f2f2;color: ;padding: 1.5rem;">
      ${type}
    </h1>
    <div style="padding: 0 1rem;">
    <h3>Dear ${username},</h3>
      <p>
        I hope this email finds you well, email if for follow up about your showed interest in before, as we promissed to notify you whenever there is a a message that may seem interesting to you according to your recorded interests 
        <p> I wanted to notify you that <b> ${message}</b></p>   
      </p>
      <div style="text-align:center;">
       <a href=${url} style="display: block; text-align: center; padding: 10px 20px; background-color: #004d99; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Check this out </a> </button>,
    </div>
    <p>Best regards, from <b>Brogrammers </b></p>
    </div>
  </div><div>`;
};

export const notificationTemplate2 = (username, message, type)=>{
  return ` <div style="width:100%;hight:50%; background-color:#f2f2f2; font-family: sans-serif, system-ui;">
  <div style="width:100%; font-family: sans-serif, system-ui;">
    <h1 style="text-align:center;background-color: #f2f2f2;color: ;padding: 1.5rem;">
      ${type}
    </h1>
    <div style="padding: 0 1rem;">
    <h3>Dear ${username},</h3>
      <p>
        I hope this email finds you well, email if for follow up about your showed interest in before, as we promissed to notify you whenever there is a a message that may seem interesting to you according to your recorded interests 
        <p> I wanted to notify you that <b> ${message}</b></p>   
      </p>
      <div style="text-align:center;">
       <a href="/users/login" style="display: block; text-align: center; padding: 10px 20px; background-color: #004d99; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Login to check </a> </button>,
    </div>
    <p>Best regards, from <b>Brogrammers </b></p>
    </div>
  </div><div>`;
};
export const newsletterTemplate = (username, newsletter, subscriberId, header, content) => {
  return `
  <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; box-shadow: 0px 0px 20px rgba(0,0,0,0.1);">
    <h1 style="color: #004d99; font-size: 28px; margin-top: 20px;">${header}</h1>
    <div style="color: #000; font-size: 16px; line-height: 1.5; margin-top: 20px;">Hello ${username},<br><br>${content}</div>
    <h2 style="color: #004d99; font-size: 24px; margin-top: 20px;">${newsletter.name}</h2>
    <img src="${newsletter.images[0]}" alt="${newsletter.name}" style="max-width: 100%; height: auto; margin-top: 20px;">
    <div style="color: #000; font-size: 16px; line-height: 1.5; margin-top: 20px;">${newsletter.description}</div>
    <div style="color: #000; font-size: 16px; line-height: 1.5; margin-top: 20px;">Price: ${newsletter.price}</div>
    <a href="${newsletter.images[0]}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #004d99; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">View newsletter</a>
    <div style="color: #000; font-size: 16px; line-height: 1.5; margin-top: 20px;">Thank you ${username} for being a loyal subscriber to our newsletter! Stay tuned for more updates.</div>
    <div style="color: #000; font-size: 14px; margin-top: 20px;">If you would like to unsubscribe from our newsletter, please click <a href="${process.env.UNSUBSCRIBE_URL}/${subscriberId}" style="color: #004d99; text-decoration: underline;">here</a>.</div>
 </div>`;
};
