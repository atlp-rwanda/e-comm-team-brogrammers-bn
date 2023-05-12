import Wishlist from '../services/wishlist.services';
// eslint-disable-next-line import/named, import/no-duplicates
import { wishlists } from '../database/models';
import paginatedResults from '../middlewares/paginating';
// eslint-disable-next-line import/named, import/no-duplicates
import { products } from '../database/models';
import {
  deleteWishlists,
  clearWishlists,
  AdmingetWishlists,
  getWishlists,
  wishlistError,
  createWishlist,
} from '../loggers/wishlist.logger';
/**
 * the wishlist controller class
 */
export default class wishlist {
  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
  static async postwish(req, res) {
    try {
      const { id: userId } = req.user;
      // eslint-disable-next-line camelcase
      const product_id = req.params.id;
      const newWish = {
        userId,
        // eslint-disable-next-line camelcase
        productId: product_id,
      };
      const wish = await Wishlist.createWish(newWish);
      createWishlist(req);
      return res.status(200).json({
        data: wish,
        message: 'product added to your wishlist successfully',
      });
    } catch (error) {
      wishlistError(req, error);
      return res.status(500).json({
        error: error.message,
        message: 'Could not add product to wishlist, try again',
      });
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
  static async getwishesofuser(req, res) {
    try {
      const userId = req.user.id;
      const userwishes = await wishlists.findAll({ where: { userId } });
      const productIds = userwishes.map((wish) => wish.productId);

      const Products = await products.findAll({
        where: {
          id: productIds,
        },
      });
      getWishlists(req, Products);
      return res.status(200).json({
        message: `${req.user.username} here is product in your wishlist`,
        data: Products,
      });
    } catch (error) {
      wishlistError(req, error);
      return res.status(500).json({
        error: error.message,
        message: 'Could not get  wishlist, try again',
      });
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
  static async deleteWish(req, res) {
    try {
      const productId = req.params.id;
      const userwish = await wishlists.findOne({ where: { productId } });
      if (userwish) {
        await wishlists.destroy({ where: { productId } });
        await userwish.save();
        deleteWishlists(req, userwish);
        return res.status(200).json({
          message: 'deleted from wishlist ',
        });
      }
      return res.status(400).json({
        message: 'you dont have this product in your wishlist',
      });
    } catch (error) {
      wishlistError(req, error);
      return res.status(500).json({
        error: error.message,
        message: 'Could delete   wish, try again',
      });
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
  static async getallawishlists(req, res) {
    try {
      paginatedResults(wishlists)(req, res, () => res.status(200).json(res.paginatedResults));
      AdmingetWishlists(req, res.paginatedResults);
    } catch (error) {
      wishlistError(req, error);
      return res.status(500).json({
        error: error.message,
        message: 'Could not get  wishlist, try again',
      });
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
  static async clearWishlist(req, res) {
    try {
      const userId = req.user.id;
      const userwishes = await wishlists.findAll({ where: { userId } });
      if (userwishes !== []) {
        await wishlists.destroy({ where: { userId } });
        clearWishlists(req, userwishes);
        return res.status(200).json({
          message: ' wishlists have been cleared',
        });
      }

      return res.status(400).json({
        message: 'no wishlist to clear',
      });
    } catch (error) {
      wishlistError(req, error);
      return res.status(500).json({
        error: error.message,
        message: 'Could not clear  wishlist, try again',
      });
    }
  }
}
