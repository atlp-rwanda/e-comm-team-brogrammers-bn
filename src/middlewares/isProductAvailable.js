// eslint-disable-next-line import/named
import { products } from '../database/models';

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {res} response
 */
export default async function isAvailable(req, res, next) {
  try {
    const { id } = req.params;
    if (!id || id === null) return res.status(400).json({ message: 'id is not supposed to be null' });
    const product = await products.findOne({ where: { id } });
    if (!product || product === null) return res.status(400).json({ message: 'product not found' });
    if (!product.available) return res.status(400).json({ message: 'product not available' });

    req.product = product;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'server error' });
  }
}
