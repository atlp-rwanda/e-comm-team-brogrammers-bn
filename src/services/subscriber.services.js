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

  static async getAllSubscribers(pageNumber, limitNumber) {
    const totalCount = await Subscriber.count();
    const page = Number(pageNumber) || 1;
    const limit = Number(limitNumber) || totalCount;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const out = {
      totalCount,
      totalPages: Math.ceil(totalCount / limit)
    };
    if (endIndex < totalCount) {
      out.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      out.previous = {
        page: page - 1,
        limit,
      };
    }

    const allSubscribers = await Subscriber.findAll({
      limit,
      offset: startIndex,
    });
    return { ...out, results: allSubscribers };
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
