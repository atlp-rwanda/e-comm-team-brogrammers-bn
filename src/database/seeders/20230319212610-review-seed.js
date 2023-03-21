/* eslint-disable no-plusplus */
/* eslint-disable import/named */
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { users, products } from '../models';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const allUsers = await users.findAll();
    const allProducts = await products.findAll();

    const reviews = [];
    for (let i = 0; i < 10; i++) {
      const userIndex = faker.datatype.number({
        min: 0,
        max: allUsers.length - 1,
      });
      const productIndex = faker.datatype.number({
        min: 0,
        max: allProducts.length - 1,
      });

      const review = {
        id: faker.datatype.uuid(),
        userId: allUsers[userIndex].dataValues.id,
        productId: allProducts[productIndex].dataValues.id,
        feedback: faker.lorem.sentences(),
        rating: faker.datatype.number({ min: 1, max: 5 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      reviews.push(review);
    }

    await queryInterface.bulkInsert('reviews', reviews);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('reviews', null, {});
  },
};
