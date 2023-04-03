import { faker } from '@faker-js/faker';
// eslint-disable-next-line import/named
import { users } from '../models';

export default {
  async up(queryInterface) {
    const allUsers = await users.findAll({ where: { role: 'buyer' } });
    const allStatus = ['Pending', 'Processing', 'Shipped', 'Delivered'];

    const orders = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 5; i++) {
      const userIndex = faker.datatype.number({
        min: 0,
        max: allUsers.length - 1,
      });

      const statusIndex = faker.datatype.number({
        min: 0,
        max: allStatus.length - 1,
      });
      const paid = statusIndex > 0;

      const order = {
        id: faker.datatype.uuid(),
        deliveryCountry: faker.address.country(),
        deliveryCity: faker.address.city(),
        deliveryStreet: faker.address.streetAddress(),
        buyerId: allUsers[userIndex].dataValues.id,
        status: allStatus[statusIndex],
        isPaid: paid,
        paymentMethod: faker.finance.creditCardIssuer(),
        totalAmount: faker.datatype.float(0.01),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      orders.push(order);
    }

    await queryInterface.bulkInsert('order', orders);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('order', null, {});
  },
};
