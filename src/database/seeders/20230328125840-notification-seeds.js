import { faker } from '@faker-js/faker';
// eslint-disable-next-line import/named
import { users } from '../models';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const allUsers = await users.findAll({ where: { role: 'buyer' } });
    const notifications = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 20; i++) {
      const userIndex = faker.datatype.number({
        min: 0,
        max: allUsers.length - 1,
      });

      const notification = {
        id: faker.datatype.uuid(),
        message: faker.random.words(10),
        type: faker.helpers.shuffle([
          'products',
          'payment',
          'news',
          'updates',
        ])[0],
        receiverId: allUsers[userIndex].dataValues.id,
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      notifications.push(notification);
    }

    await queryInterface.bulkInsert('notifications', notifications);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('notifications', null, {});
  },
};
