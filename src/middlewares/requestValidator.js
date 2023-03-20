/**
 * validation function
 * @param {Function} validator
 * @returns {Function} middleware
 */
export default function (validator) {
  return (req, res, next) => {
    try {
      const { body } = req;

      const { error } = validator(body, { abortEarly: false });
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      next();
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Validation failed', error: error.message });
    }
  };
}
