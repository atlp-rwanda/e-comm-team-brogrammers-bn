/* eslint-disable import/named */
// eslint-disable-next-line max-len
// eslint-disable-next-line import/named, import/no-named-as-default, import/no-named-as-default-member
import cartService from '../services/carts.services';
import { carts } from '../database/models';
import paginatedResults from '../middlewares/paginating';

import {
  viewAllCarts,
  clearCarts,
  viewCart,
  ItemError,
  cartLogger,
} from '../loggers/cart.logger';
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
      cartLogger(req, result.value);
      return res.status(201).json({ value: result.value });
    } catch (error) {
      ItemError(req, error);
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
  static async removeFromCart(req, res) {
    try {
      const { cart } = req;
      const { id } = req.params;
      const productToRemove = cart.products.findIndex(
        (product) => product.id === id
      );
      const removedProduct = cart.products[productToRemove];
      cart.products.splice(productToRemove, 1);
      const total = cart.total - removedProduct.price * removedProduct.quantity;
      await cartService.updateCart({ products: cart.products, total }, cart.id);
      return res.status(200).json({
        id: cart.id,
        message: 'Item removed from cart successfully',
        total
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
        message: 'Could not remove item from cart, try again',
      });
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
      viewCart(req, result.value);
      return res.status(200).json({ value: result.value });
    } catch (error) {
      ItemError(req, error);
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
      clearCarts(req);
      return res.status(200).json({ value: result.value });
    } catch (error) {
      ItemError(req, error);
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
      paginatedResults(carts)(req, res, () => res.status(200).json(res.paginatedResults));
      viewAllCarts(req, res.paginatedResults);
    } catch (error) {
      ItemError(req, error);
      res.status(500).json({ status: 500, message: error });
    }
  }
}
