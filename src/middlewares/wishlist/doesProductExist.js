/* eslint-disable import/named */
// eslint-disable-next-line no-unused-vars
import { products } from '../../database/models';

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {res} response
 */
export default async function doesProductExist(req, res, next) {
  try {
    const { id: productId } = req.params;
    if (!productId || productId === null) {
      return res.status(400).json({ message: 'no id found in parameters' });
    }
    // eslint-disable-next-line no-shadow, no-undef
    const product = await products.findOne({ where: { id: productId, available: true } });
    if (!product || product === null) {
      return res.status(400).json({ message: 'product does not exist' });
    }
    req.product = product;
    next();
  } catch (error) {
    return res.status(401).json({ error });
  }
}
