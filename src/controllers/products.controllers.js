/* eslint-disable prefer-destructuring */
/* eslint-disable require-jsdoc */
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import Product from '../services/product.services';

const validUUID = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[4][a-fA-F0-9]{3}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/

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
  static async getProductReviews(req, res) {
    const product = await Product.getProduct(req.params.id);
    if (!product || product === null) {
      return res.status(404).json({ message: 'product not found' });
    }
    const productReviews = await Product.getProductReviews(req.params.id);
    return res.status(200).json(productReviews);
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
  static async getProducts(req, res) {
    try {
      const products = await Product.getProducts();
      return res.status(200).json({ products });
    } catch (err) {
      return res
        .status(500)
        .json({ error: err.message, message: 'Failed to retrieve products' });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const product = req.product;
      await product.destroy();
      return res.status(200).json({
        status: 200,
        message: 'Product deleted successfully',
        item: product,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
  static async getProduct(req, res) {
    try {
      if (req.product) return res.status(200).json(req.product);

      const product = await Product.getProduct(req.params.id);
      if (!product || product === null) {
        return res.status(404).json({ message: 'product not found' });
      }
      return res.status(200).json(product);
    } catch (err) {
      return res
        .status(500)
        .json({ error: err.message, message: 'server product' });
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
  
  static async getProductById(req, res) {
    const id = req.params.id;
    
  
    if (!validUUID.test(id)) {
      return res.status(404).json({ message: 'Product not found' });
    }
    try {
      const product = await Product.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.status(200).json({ product });
    } catch (err) {
      return res.status(500).json({ error: err.message, message: 'Failed to retrieve product' });
    }
  }

  static async getProductByIdAndSeller(req, res) {
    const id = req.params.id;
  
    if (!validUUID.test(id)) {
      return res.status(404).json({ message: 'Product not found' });
    }
  
    try {
      const product = await Product.getProductByIdAndSeller(id, req.user.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found in your collection' });
      }
      return res.status(200).json({ product });
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        return res.status(400).json({ message: 'Invalid product ID' });
      }
      return res.status(500).json({ error: err.message, message: 'Failed to retrieve product' });
    }
  }
  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
  static async toggleAvailable(req, res) {
    try {
      const product = await Product.changeAvailable(req.product);
      return res
        .status(201)
        .json({ message: 'availablility changed', product });
    } catch (err) {
      return res
        .status(500)
        .json({ error: err.message, message: 'Failed to retrieve products' });
    }
  }
}
