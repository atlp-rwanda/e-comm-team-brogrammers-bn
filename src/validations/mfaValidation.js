import joi from 'joi';

/**
 * validating user info
 * @param {Object} data data to be validated
 * @returns {Schema} output for validation
 */
export default function mfaValidation(data) {
  const Schema = joi.object({
    email: joi.string().email().required().label('email'),
    mfa_code: joi.number().required().label('mfa_code'),
  });

  return Schema.validate(data, {
    abortEarly: false,
  });
}
