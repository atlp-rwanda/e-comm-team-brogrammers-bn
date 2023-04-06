import { Jwt } from '../helpers/jwt';
import Payments from '../services/payment.services';
import { sendEmail } from '../helpers/mail';
import { emailConfig } from '../helpers/emailConfig';
import {
  paymentComplete, paymentEmail
} from '../helpers/mailTemplate';
import { logPaymentError, logPaymentFail, logPaymentSuccess } from '../loggers/payment.logger';

/**
 * payment controllers class
 */
export default class PaymentControllers {
  /**
   * @param {*} req
   * @param {*} res
   * @returns {res} response
   */
  static async success(req, res) {
    try {
      const { redirect, user, products } = await Payments.success(req);

      const email = paymentComplete(user, products);
      sendEmail(
        emailConfig({
          email: user.email,
          subject: 'Thank you for purchasing our products!',
          content: email,
        })
      );
      if (redirect) return res.redirect(301, redirect);
      logPaymentSuccess(user, products);
      return res.status(200).json({ message: 'payment successfully', url: redirect });
    } catch (err) {
      logPaymentError(req, err);
      return res.status(500).json({ message: 'server error' });
    }
  }

  /**
   * @param {*} req
   * @param {*} res
   * @returns {res} response
   */
  static async fail(req, res) {
    const { info } = req.query;
    const { value } = Jwt.verifyToken(info);
    const { redirect } = value;

    if (redirect) return res.redirect(301, redirect);
    logPaymentFail(req);
    res.status(400).json({ message: 'payment failed' });
  }

  /**
   * @param {*} req
   * @param {*} res
   * @returns {res} response
   */
  static async pay(req, res) {
    try {
      const { items, redirect, error } = await Payments.payOrder(req);

      if (error) return res.status(400).json({ error, url: redirect });

      const email = paymentEmail(req.user, items, redirect);
      sendEmail(
        emailConfig({
          email: req.user.email,
          subject: 'Thanks for your interest in our products!',
          content: email,
        })
      );
      return res.status(200).json({ items, url: redirect });
    } catch (error) {
      logPaymentError(req, error);
      return res.status(500).json({ message: 'server error', error });
    }
  }
}
