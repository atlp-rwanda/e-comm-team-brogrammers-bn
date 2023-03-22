/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/named */
/* eslint-disable require-jsdoc */
import moment from 'moment';
import { scheduleJob } from 'node-schedule';
import { users } from '../database/models';
import { emailConfig } from './emailConfig';
import { expireProduct, expireProductWarning } from './mailTemplate';
import { sendEmail } from './mail';

// variables, time in days
const warningTime = 30;
const warningTimeFormat = 'days';

function diff(t1, t2, format) {
  t1 = moment(t1);
  t2 = moment(t2);

  return t2.diff(t1, format || 'hours');
}

function scheduleExpirationEmail(date, callback) {
  date = new Date(date);
  const expSchedule = new scheduleJob(date, () => {
    expSchedule.cancel();
    callback();
  });

  const warnDate = new Date(date);
  warnDate.setDate(warnDate.getDate() - warningTime);
  const expWarnSchedule = new scheduleJob(warnDate, () => {
    expWarnSchedule.cancel();
    callback();
  });
}

export default async function checkExpiredProduct(product) {
  try {
    const exp = new Date(product.exp_date);
    exp.setHours(exp.getHours() + 24);
    const time = diff(new Date(), exp, warningTimeFormat);

    if (time <= 0) {
      if (product.available) {
        const user = await users.findOne({ where: { id: product.sellerId } });
        product.available = false;
        product.save();
        const html = expireProduct(user, product);
        sendEmail(
          emailConfig({
            email: user.email,
            subject: `Important: ${product.name} has Expired`,
            content: html
          })
        );
      }
    } else if (time <= warningTime) {
      scheduleExpirationEmail(new Date(product.exp_date), () => checkExpiredProduct(product));

      const user = await users.findOne({ where: { id: product.sellerId } });
      const html = expireProductWarning(user, product);
      sendEmail(
        emailConfig({
          email: user.email,
          subject: `Expiry Date of ${product.name} is Approaching`,
          content: html
        })
      );
    } else {
      scheduleExpirationEmail(new Date(product.exp_date), () => checkExpiredProduct(product));
    }
    return { value: 'checked' };
  } catch (error) {
    return { error };
  }
}
