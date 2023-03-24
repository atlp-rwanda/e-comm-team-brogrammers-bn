// eslint-disable-next-line import/named
import { wishlists } from '../database/models';

/**
 * function to register user
 * @param {Object} data the information for user to be created
 * @returns {data} for the created user
 */
export default class Wishlist {
  // eslint-disable-next-line require-jsdoc
  static async createWish(wish) {
    const createWish = await wishlists.create(wish);
    return createWish;
  }

  // eslint-disable-next-line require-jsdoc
  static async getwish() {
    const allwishes = await wishlists.findAll();
    return allwishes;
  }

  // eslint-disable-next-line require-jsdoc
  static async getallwishes() {
    const allwishes = await wishlists.findAll();
    return allwishes;
  }

  // eslint-disable-next-line require-jsdoc
  static async getallwishlists() {
    const allwishes = await wishlists.findAll();
    return allwishes;
  }

  // eslint-disable-next-line require-jsdoc
  static async clearwishlist() {
    const allwishes = await wishlists.findAll();
    return allwishes;
  }
}
