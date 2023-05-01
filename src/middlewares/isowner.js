// eslint-disable-next-line import/named
import { products } from '../database/models';

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {res} response
 */
export default async function isOwner(req, res, next) {
  try {
    const { id } = req.params;
    if (!id || id === null) return res.status(400).json({ message: "product doesn't exist" });

    const product = await products.findOne({ where: { id } });
    if (!product || product === null) return res.status(400).json({ message: "product doesn't exist" });

    if (product.sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: "you're not authorized" });
    }
    req.product = product;
    next();
  } catch (error) {
    return res.status(401).json({ error });
  }
}
