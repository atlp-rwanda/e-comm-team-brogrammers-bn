import Joi from 'joi';

/**
 * Check for new password
 * @param {*} data data
 * @returns {Object} result
 */
export function createReviewValidate(data) {
  const schema = Joi.object({
    feedback: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    productId: Joi.string().length(36).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
/**
 * Check for new password
 * @param {*} data data
 * @returns {Object} result
 */
export function updateReviewValidate(data) {
  const schema = Joi.object({
    feedback: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
