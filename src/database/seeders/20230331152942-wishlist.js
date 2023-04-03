/* eslint-disable import/named */
import { faker } from '@faker-js/faker';
import { users, products } from '../models';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const allWishes = [];
    const allusers = await users.findAll({});
    const allProducts = await products.findAll({});

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 10; i++) {
      const userIndex = faker.datatype.number({
        min: 0,
        max: allusers.length - 1,
      });
      const productIndex = faker.datatype.number({
        min: 0,
        max: allProducts.length - 1,
      });

      const wish = {
        id: faker.datatype.uuid(),
        userId: allusers[userIndex].id,
        productId: allProducts[productIndex].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      allWishes.push(wish);
    }

    await queryInterface.bulkInsert('wishlists', allWishes);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('wishlists', null, {});
  }
};
