/* eslint-disable import/named */
/* eslint-disable require-jsdoc */
import { products } from '../database/models';
import checkExpiredProduct from '../helpers/expiredProduct';

export default async function beforeCheckExpiredProduct() {
  try {
    const allProducts = await products.findAll();
    allProducts.forEach(async (product) => {
      checkExpiredProduct(product);
    });
    return { value: 'checked' };
  } catch (error) {
    return { error };
  }
}
