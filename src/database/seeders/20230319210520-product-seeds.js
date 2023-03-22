/* eslint-disable no-plusplus */
import { faker } from '@faker-js/faker';
import { uuid } from 'uuidv4';
// eslint-disable-next-line import/named
import { users, category } from '../models';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const allUsers = await users.findAll();
    const allCategories = await category.findAll();

    const products = [];
    for (let i = 0; i < 5; i++) {
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
          faker.image.imageUrl(),
          faker.image.imageUrl(),
          faker.image.imageUrl(),
        ],
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        quantity: faker.datatype.number(100),
        sellerId: allUsers[userIndex].dataValues.id,
        exp_date: faker.date.future(),
        available: faker.datatype.boolean(),
        price: faker.commerce.price(),
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
