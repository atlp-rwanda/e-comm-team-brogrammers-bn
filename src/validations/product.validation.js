import joi from 'joi';

/**
 * validating user info
 * @param {Object} data data to be validated
 * @returns {Schema} output for validation
 */
export default async function productValidation(data) {
  const Schema = joi.object({
    name: joi
      .string()
      .min(3)
      .max(255)
      .required()
      .label('name'),
    description: joi.string().min(5).max(2000).label('description'),
    quantity: joi.number().min(0).required().label('quantity'),
    sellerId: joi.string().uuid().required().label('sellerId'),
    expdate: joi.date().min('now').label('expiration data'),
    price: joi.number().min(0).required().label('price'),
    category: joi.number().min(0).label('category')
  });

  // eslint-disable-next-line no-return-await
  return await Schema.validate(data, {
    abortEarly: false
  });
}
