// eslint-disable-next-line import/named
import { wishlists } from '../../database/models';

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {res} response
 */
export default async function isItemInWishlist(req, res, next) {
  try {
    const productId = req.params.id;
    const user = req.user.id;
    const wished = await wishlists.findOne({
      // eslint-disable-next-line object-shorthand
      where: { productId: productId, userId: user },
    });
    if (wished || wished !== null) {
      return res.status(400).json({ message: 'product already in wishlist' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error });
  }
}
