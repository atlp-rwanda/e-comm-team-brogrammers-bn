/* eslint-disable import/named */
import { faker } from '@faker-js/faker';
import { users } from '../models';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const allChats = [];
    const allRooms = ['brogrammers'];
    const allusers = await users.findAll({});

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 10; i++) {
      const userIndex = faker.datatype.number({
        min: 0,
        max: allusers.length - 1,
      });
      const roomIndex = faker.datatype.number({
        min: 0,
        max: allRooms.length - 1,
      });
      const date = faker.date.past();

      const message = {
        id: faker.datatype.uuid(),
        room: allRooms[roomIndex],
        message: faker.lorem.sentences(),
        userId: allusers[userIndex].id,
        createdAt: date,
        updatedAt: date,
      };

      allChats.push(message);
    }

    await queryInterface.bulkInsert('Chat', allChats);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Chat', null, {});
  }
};
