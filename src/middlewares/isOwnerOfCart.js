// eslint-disable-next-line import/named
import { carts } from '../database/models';

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {res} response
 */
export default async function isOwnerOfCart(req, res, next) {
  try {
    const userId = req.user.id;
    const cart = await carts.findOne({ where: { userId } });
    if (!cart || cart === null) return res.status(400).json({ message: 'your cart is empty' });
    req.cart = cart;
    next();
  } catch (error) {
    return res.status(401).json({ error });
  }
}
