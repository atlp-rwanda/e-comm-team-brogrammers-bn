import joi from 'joi';

/**
 * validating user info
 * @param {Object} data data to be validated
 * @returns {Schema} output for validation
 */
export default function loginValidation(data) {
  const Schema = joi.object({
    email: joi.string().email().required().label('email'),
    password: joi.string().required().label('password'),
  });

  return Schema.validate(data, {
    abortEarly: false,
  });
}
