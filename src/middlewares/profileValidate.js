import profileValidation from '../validations/profile.validate';

/**
 * validation function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next next to other function
 * @returns {Object} response if error
 */
export default async function profileVatidate(req, res, next) {
  const { body } = req;
  const { error } = await profileValidation(body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
}
