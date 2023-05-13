/* eslint-disable no-shadow */
/* eslint-disable import/named */
/* eslint-disable prefer-const */
/* eslint-disable require-jsdoc */
// eslint-disable-next-line import/named
import { Op } from 'sequelize';
import {
  products, category, reviews, users
} from '../database/models';
import CloudUpload from '../helpers/cloud.upload';
import checkExpiredProduct from '../helpers/expiredProduct';

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
      name,
      // eslint-disable-next-line prefer-const
      description,
      quantity,
      price,
      expdate,
      category,
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
      images,
    });
    checkExpiredProduct(value);

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
    if (expdate && expdate !== null) {
      product.exp_date = new Date(expdate);
      checkExpiredProduct(product);
    }
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

  /**
   * @returns {products} allproducts
   */
  static async getProducts() {
    const allproducts = await products.findAll({
      where: { available: true },
      attributes: { exclude: ['sellerId'] },
      include: {
        model: users,
        as: 'seller',
        attributes: ['username', 'email']
      }
    });
    return allproducts;
  }

  /**
   * @param {String} id
   * @returns {products} allproducts
   */
  static async getProduct(id) {
    const product = await products.findOne({
      where: { id },
      attributes: { exclude: ['sellerId'] },
      include: [{
        model: users,
        as: 'seller',
        attributes: ['username', 'email']
      },
      {
        model: reviews,
        as: 'reviews',
      }],
    });
    return product;
  }

  /**
   * @param {Object} user
   * @returns {products} allproducts
   */
  static async sellergetProduct(user) {
    const allproducts = await products.findAll({
      where: { sellerId: user.id },
    });
    return allproducts;
  }

  static async getProductById(id) {
    const product = await products.findByPk(id);
    return product;
  }

  static async getProductByIdAndSeller(id, sellerId) {
    const product = await products.findOne({
      where: {
        id,
        sellerId,
      },
      attributes: { exclude: ['sellerId'] },
      include: {
        model: users,
        as: 'seller',
        attributes: ['username', 'email']
      }
    });
    return product;
  }

  static async getProductName(productId, userId) {
    const product = await products.findOne({
      where: { id: productId, sellerId: userId },
    });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  static async getProductReviews(reviewsProductId) {
    const productReviews = await reviews.findAll({
      where: { productId: reviewsProductId },
      include: {
        model: users,
        as: 'reviewer',
        attributes: ['username', 'email', 'avatar']
      }
    });
    const AvRate = productReviews
      .reduce((sum, review) => sum + review.rating, 0) / productReviews.length;
    const ratingCounts = productReviews.reduce((counts, review) => {
      const { rating } = review;
      counts[rating] = (counts[rating] || 0) + 1;
      return counts;
    }, {});
    const totalRates = {

      1: ratingCounts[1] || 0,
      2: ratingCounts[2] || 0,
      3: ratingCounts[3] || 0,
      4: ratingCounts[4] || 0,
      5: ratingCounts[5] || 0,
      AvRate
    };
    console.log(totalRates);
    const results = {
      productReviews,
      totalRates,
    };

    return results;
  }

  /**
   * @param {Object} product
   * @returns {products} allproducts
   */
  static async changeAvailable(product) {
    product.available = !product.available;
    product.save();
    return product;
  }

  static async searchProducts(query, min, max, categry, pageNumber, limitNumber) {
    let where = {};
    if (!min) min = 0;
    if (!max || max < min) max = Infinity;
    if (!query) query = '';
    where = {
      price: { [Op.between]: [min, max] },
      available: true,
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
      ],
    };
    if (categry) {
      const cat = await category.findAll({
        where: { title: { [Op.iLike]: `%${categry}%` } },
      });
      const ids = cat.map((item) => Number(item.id));
      if (cat) {
        where.category = { [Op.in]: ids || [] };
      }
    }

    let totalCount = await products.count({ where });
    const page = Number(pageNumber) || 1;
    const limit = Number(limitNumber) || totalCount;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const out = {
      totalCount,
      totalPages: Math.ceil(totalCount / limit)
    };
    if (endIndex < totalCount) {
      out.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      out.previous = {
        page: page - 1,
        limit,
      };
    }

    const product = await products.findAll({
      where,
      limit,
      offset: startIndex,
      attributes: { exclude: ['sellerId'] },
      include: {
        model: users,
        as: 'seller',
        attributes: ['username', 'email']
      }
    });

    return { ...out, results: product };
  }
}
