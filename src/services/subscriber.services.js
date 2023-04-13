/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */
/* eslint-disable require-jsdoc */
// eslint-disable-next-line import/named
import { Subscriber, products } from '../database/models';

/**
 * class for all user services
 */
export default class Subscribers {
  /**
   * function to register user
   * @param {Object} data the information for user to be created
   * @returns {data} for the created user
   */
  static async register(data) {
    const { email, firstName, lastName } = data;
    // eslint-disable-next-line max-len
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const subscribe = await Subscriber.create({
      firstName,
      email,
      lastName,
      verificationToken
    });

    return { data: subscribe };
  }

  static async findByVerificationToken(verificationToken) {
    const subscriber = await Subscriber.findOne({
      where: {
        verificationToken,
      },
    });
    return subscriber;
  }

  static async verifySubscriber(subscriber) {
    subscriber.subscribed = true;
    subscriber.verificationToken = null;
    await subscriber.save();
  }

  static async findById(id) {
    const subscriber = await Subscriber.findOne({ where: { id: `${id}` } });
    return subscriber;
  }

  static async getAllSubscribers() {
    const allSubscribers = await Subscriber.findAll();
    return allSubscribers;
  }

  static async getAllSubscribersTrue() {
    const allSubscribers = await Subscriber.findAll({
      where: {
        subscribed: true,
      },
    });
    return allSubscribers;
  }

  static async getProducts() {
    const product = await products.findAll({
      limit: 1,
      order: [['createdAt', 'DESC']],
    });
    return product;
  }
}
