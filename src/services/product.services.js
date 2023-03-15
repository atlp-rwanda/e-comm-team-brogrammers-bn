// eslint-disable-next-line import/named
import { products } from '../database/models';
import CloudUpload from '../helpers/cloud.upload';

/**
 * product services
 */
export default class Product {
  /**
   * @param {Object} data
   * @param {Object} files
   * @param {Object} user
   * @returns {value | error} it returns value or error
   */
  static async addProduct(data, files, user) {
    if (files.length < 2) {
      return { error: 'images must be more than 1' };
    }

    let {
      // eslint-disable-next-line prefer-const
      name, description, quantity, price, expdate, category
    } = data;
    if (!expdate || expdate === null) expdate = '01-01-2100';

    const results = await CloudUpload.multi(files);

    const images = results.map((each) => each.url);

    const value = await products.create({
      name,
      description,
      quantity,
      price,
      exp_date: new Date(expdate),
      sellerId: user.id,
      category,
      images
    });

    return { value };
  }

  /**
   * @param {Object} data
   * @param {Object} files
   * @param {Object} product
   * @returns {value | error} it returns value or error
   */
  static async editProduct(data, files, product) {
    const {
      name, description, quantity, expdate, price, category
    } = data;

    if (name && name !== null) product.name = name;
    if (description && description !== null) product.description = description;
    if (quantity && quantity !== null) product.quantity = quantity;
    if (expdate && expdate !== null) product.exp_date = new Date(expdate);
    if (price && price !== null) product.price = price;
    if (category && category !== null) product.category = category;

    if (files && files !== null && files.length !== 0) {
      if (files.length < 2) {
        return { error: 'images must be more than 1' };
      }

      const results = await CloudUpload.multi(files);
      product.images = results.map((each) => each.url);
    }
    await product.save();
    return { value: product };
  }
}
