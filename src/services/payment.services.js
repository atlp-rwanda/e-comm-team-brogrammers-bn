/* eslint-disable no-await-in-loop */
/* eslint-disable import/named */
import Stripe from 'stripe';
import { Jwt } from '../helpers/jwt';
import {
  order, products, payments
} from '../database/models';

const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(secretKey);

/**
 * payment
 */
export default class Payments {
  /**
   * @param {Object} req
   * @returns {message} success
   */
  static async success(req) {
    const { info, session: sessionId } = req.query;
    const { value } = Jwt.verifyToken(info);
    const { user, redirect, orderId } = value;

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const ordered = await order.findOne({
      where: { id: orderId },
      include: {
        model: products,
        as: 'products',
        attributes: ['id', 'images', 'name', 'available', 'price']
      }
    });

    const pay = {
      amount: session.amount_total,
      orderId,
      method: ordered.paymentMethod,
      discount: session.total_details.amount_discount,
      stripeId: session.id
    };
    const orderPayment = await payments.create(pay);
    await order.update(
      { status: 'Processing', isPaid: true, paymentId: orderPayment.id },
      { where: { id: ordered.id } }
    );
    // eslint-disable-next-line no-restricted-syntax
    for (const item of ordered.products) {
      const product = await products.findOne({
        where: { id: item.id }
      });
      product.quantity -= item.orderitem.quantity;
      product.save();
    }

    return { redirect, user, products: ordered.products };
  }

  /**
   * @param {Object} req
   * @returns {object} message
   */
  static async payOrder(req) {
    const ordered = await order.findOne({
      where: { id: req.params.id },
      include: {
        model: products,
        as: 'products',
        attributes: ['id', 'images', 'name', 'available', 'price']
      }
    });

    const serverURL = `${req.protocol}://${req.get('host')}`;
    const { success } = req.body;
    let { fail } = req.body;

    if (!fail) {
      fail = req.headers.referrer || req.headers.referer;
    }

    if (!ordered || ordered === null) return { error: { message: 'no such order' }, redirect: fail };

    if (ordered.isPaid) {
      return { error: { message: 'order is already paid' }, redirect: fail };
    }

    const successInfo = Jwt.generateToken({
      user: req.user,
      orderId: req.params.id,
      redirect: success
    });
    const failInfo = Jwt.generateToken({ user: req.user, redirect: fail });

    const items = ordered.products.map((item) => ({
      price_data: {
        product_data: {
          name: item.name,
          images: item.images
        },
        unit_amount: item.price * 100,
        currency: 'usd',
      },
      quantity: item.orderitem.quantity
    })).filter((item) => (item && item !== null));

    const exp = new Date();
    exp.setHours(exp.getHours + 2);
    const session = await stripe.checkout.sessions.create({
      customer_email: req.user.email,
      line_items: items,
      mode: 'payment',
      payment_method_types: ['card'],
      success_url: `${serverURL}/payment/success?info=${successInfo}&session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${serverURL}/payment/fail?info=${failInfo}`,
    });

    return { items: ordered.products, redirect: session.url };
  }
}
