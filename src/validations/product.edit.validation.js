import joi from 'joi';

/**
 * validating user info
 * @param {Object} data data to be validated
 * @returns {Schema} output for validation
 */
export default async function productEditValidation(data) {
  const Schema = joi.object({
    name: joi.string().min(3).max(255).label('name'),
    description: joi.string().min(5).max(2000).label('description'),
    quantity: joi.number().min(0).label('quantity'),
    sellerId: joi.string().uuid().label('sellerId'),
    expdate: joi.string().label('expiration data'),
    price: joi.number().min(0).label('price'),
    category: joi.number().min(0).label('category')
  });

  // eslint-disable-next-line no-return-await
  return await Schema.validate(data, {
    abortEarly: false
  });
}
