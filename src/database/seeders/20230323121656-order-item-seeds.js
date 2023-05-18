import { faker } from '@faker-js/faker';
// eslint-disable-next-line import/named
import { order, products } from '../models';

export default {
  async up(queryInterface) {
    const allProducts = await products.findAll();
    const allOrders = await order.findAll();

    const orderItems = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 10; i++) {
      const orderIndex = faker.datatype.number({
        min: 0,
        max: allOrders.length - 1,
      });
      const productIndex = faker.datatype.number({
        min: 0,
        max: allProducts.length - 1,
      });

      const orderItem = {
        id: faker.datatype.uuid(),
        orderId: allOrders[orderIndex].id,
        productId: allProducts[productIndex].id,
        quantity: faker.datatype.number({ min: 0, max: allProducts[productIndex].quantity }),
        price: allProducts[productIndex].price,
        statusUpdated: false,
      };

      orderItems.push(orderItem);
    }

    await queryInterface.bulkInsert('orderitem', orderItems, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('orderitem', null, {});
  },
};
