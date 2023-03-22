import Joi from 'joi';

/**
 * Check for new password
 * @param {*} data data
 * @returns {Object} result
 */
export default function disableUser(data) {
  const schema = Joi.object({
    reason: Joi.string().min(5).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
