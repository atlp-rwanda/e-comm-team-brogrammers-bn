// eslint-disable-next-line max-len
// eslint-disable-next-line import/named, import/no-named-as-default, import/no-named-as-default-member
import cartService from '../services/carts.services';

/**
 * the cart controller class
 */
export default class Cartcontroller {
  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
  static async addItemTocart(req, res) {
    try {
      const result = await cartService.addItem(req);
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }
      return res.status(201).json({ value: result.value });
    } catch (error) {
      res.status(500).json({ status: 500, message: error });
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
  static async deleteItemFromCart(req, res) {
    try {
      const result = await cartService.deleteItem(req);
      return res.status(200).json({ value: result.value });
    } catch (error) {
      res.status(500).json({ status: 500, message: error });
    }
  }

/**
  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
  static async viewCartOfUser(req, res) {
    try {
      const result = await cartService.viewCart(req);
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }
      return res.status(200).json({ value: result.value });
    } catch (error) {
      res.status(500).json({ status: 500, message: error });
    }
  }

  /**
 * @param {Object} req
 * @param {Object} res
 * @returns {res} response
 */
static async clearCart(req, res) {
  try {
    const result = await cartService.clearCart(req);
    return res.status(200).json({ value: result.value });
  } catch (error) {
    res.status(500).json({ status: 500, message: error });
  }
}
 /**
 * @param {Object} req
 * @param {Object} res
 * @returns {res} response
 */
 static async viewAllCartOfUsers(req, res) {
  try {
    const result = await cartService.viewAllCarts();
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    return res.status(200).json({ value: result.value });
  } catch (error) {
    res.status(500).json({ status: 500, message: error });
  }
}
}
