import validation from '../validations/product.validation';

/**
 * validation function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next next to other function
 * @returns {Object} response if error
 */
export default async function productVatidate(req, res, next) {
  const { body } = req;
  body.sellerId = req.user.id;
  const { error } = await validation(body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
}
