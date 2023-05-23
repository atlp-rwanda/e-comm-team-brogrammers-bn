import Joi from 'joi';

/**
 * Check for new password
 * @param {*} data data
 * @returns {Object} result
 */
export default async function orderValidation(data) {
  const schema = Joi.object({
    deliveryCountry: Joi.string().min(2).required().label('country'),
    deliveryCity: Joi.string().min(1).required().label('city'),
    deliveryStreet: Joi.string().min(2).required().label('street'),
    paymentMethod: Joi.string().min(2),
  });
  const out = schema.validate(data, {
    abortEarly: false
  });
  return out;
}
