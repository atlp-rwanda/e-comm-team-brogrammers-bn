/* eslint-disable import/named */
import { faker } from '@faker-js/faker';
import { order } from '../models';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const allOrders = await order.findAll({ where: { isPaid: true } });
    const allPayments = [];
    const stripeIds = [
      'cs_test_b1nnYG4jFlA1axzKRhj1LJrlcLig2yiFGnTxTWaX7SYCPeitfqRSoECsKA',
      'cs_test_b1d1JN9wTy6gTs5ozmEoi2MGUb4GxFuImYh0GFnU5wywfuewsmCIEcWNHp',
      'cs_test_b1uWxbyNLZui6eZZrGzAWbJbVgNIKqmPSat2k3ShviYJU0tiR9ubqm0OKb',
      'cs_test_b1eTjuln2msGcGhx5fzA7eBVOpR6WJkx5Nkpd8VxGAK4RwKxwyqfBox5WM',
      'cs_test_a1FZcWZC5EWkfD6WKR2Ec4md1OQS35shUFMjTwl798upUORfjsXVtZ21Hf'
    ];

    let i = 0;
    // eslint-disable-next-line no-restricted-syntax, no-shadow
    for (const order of allOrders) {
      const strIndex = i % stripeIds.length;
      i += 1;
      const date = faker.date.between((new Date()).setDate(new Date().getDate() - 4), new Date());

      const payment = {
        id: faker.datatype.uuid(),
        amount: order.totalAmount,
        orderId: order.id,
        method: order.paymentMethod,
        discount: 0,
        stripeId: stripeIds[strIndex],
        createdAt: date,
        updatedAt: date,
      };

      allPayments.push(payment);
    }
    await queryInterface.bulkInsert('payments', allPayments);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('payments', null, {});
  }
};
