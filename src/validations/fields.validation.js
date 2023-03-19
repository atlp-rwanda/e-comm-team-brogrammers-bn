import Joi from 'joi';

import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);
/**
 * Validate email
 * @param {*} data data
 * @returns {Object} result
 */
export function hasEmail(data) {
  const schema = Joi.object({
    email: Joi.string().email().required().label('email'),
  });
  return schema.validate(data, { abortEarly: false });
}

/**
 * Check for new password
 * @param {*} data data
 * @returns {Object} result
 */
export function resetPassword(data) {
  const schema = Joi.object({
    email: Joi.string().email().required().label('email'),
    newPassword: joiPassword
      .string()
      .min(8)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .minOfSpecialCharacters(1)
      .required()
      .label('password'),
  });
  return schema.validate(data, { abortEarly: false });
}
