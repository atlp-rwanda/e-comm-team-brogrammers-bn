// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import Product from '../services/product.services';

/**
 * the product controller class
 */
export default class Products {
  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
  static async postProduct(req, res) {
    try {
      const { error, value } = await Product.addProduct(
        req.body,
        req.files,
        req.user
      );
      if (error) return res.status(400).json({ message: 'bad request', error });
      return res
        .status(201)
        .json({ message: 'product created', product: value });
    } catch (error) {
      return res.status(500).json({ message: 'server error', error });
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
  static async editProduct(req, res) {
    try {
      const { error, value } = await Product.editProduct(
        req.body,
        req.files,
        req.product
      );
      if (error) return res.status(400).json({ message: 'bad request', error });
      return res
        .status(200)
        .json({ message: 'product edited', product: value });
    } catch (error) {
      return res.status(500).json({ message: 'server error', error });
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
  static async getProduct(req, res) {
    try {
      const products = await Product.getProduct();
      return res.status(200).json({ products });
    } catch (err) {
      return res
        .status(500)
        .json({ error: err.message, message: 'Failed to retrieve products' });
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
  static async sellergetProduct(req, res) {
    try {
      const products = await Product.sellergetProduct(req.user);
      return res.status(200).json({ products });
    } catch (err) {
      return res
        .status(500)
        .json({ error: err.message, message: 'Failed to retrieve products' });
    }
  }
}
