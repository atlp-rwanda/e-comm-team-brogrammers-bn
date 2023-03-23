import Joi from 'joi';

/**
 * Check for new password
 * @param {*} data data
 * @returns {Object} result
 */
export default function orderValidation(data) {
  const schema = Joi.object({
    deliveryCountry: Joi.string().required().min(2),
    deliveryCity: Joi.string().required().min(1),
    deliveryStreet: Joi.string().required().min(2),
    paymentMethod: Joi.string().min(2).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
