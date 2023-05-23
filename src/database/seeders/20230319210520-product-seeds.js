/* eslint-disable import/named */
/* eslint-disable no-plusplus */
import { faker } from '@faker-js/faker';
import { uuid } from 'uuidv4';
import { Op } from 'sequelize';
import { users, category } from '../models';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const allUsers = await users.findAll({ where: { role: { [Op.not]: 'buyer' } } });
    const allCategories = await category.findAll();

    const products = [];
    for (let i = 0; i < 15; i++) {
      const userIndex = faker.datatype.number({
        min: 0,
        max: allUsers.length - 1,
      });
      const categoryIndex = faker.datatype.number({
        min: 0,
        max: allCategories.length - 1,
      });

      const product = {
        id: uuid(),
        images: [
          faker.image.food(undefined, undefined, true),
          faker.image.food(undefined, undefined, true),
          faker.image.food(undefined, undefined, true),
          faker.image.food(undefined, undefined, true),
        ],
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        quantity: faker.datatype.number({ min: 100, max: 1000 }),
        sellerId: allUsers[userIndex].dataValues.id,
        exp_date: faker.date.future(2),
        available: true,
        price: faker.commerce.price(40, 20000),
        category: allCategories[categoryIndex].dataValues.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      products.push(product);
    }
    await queryInterface.bulkInsert('products', products, {});
  },

  /**
   * Down
   * @param {QueryInterface} queryInterface
   * @returns {void}
   */
  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
  },
};
