import joi from 'joi';

/**
 * validating user info
 * @param {Object} data data to be validated
 * @returns {Schema} output for validation
 */
export default function subscribeValidation(data) {
  const subscriberSchema = joi.object({
    email: joi.string().email().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    subscribed: joi.boolean(),
    verificationToken: joi.string(),
  });

  return subscriberSchema.validate(data, {
    abortEarly: false,
  });
}
