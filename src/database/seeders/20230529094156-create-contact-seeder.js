// eslint-disable-next-line import/no-extraneous-dependencies
import { uuid } from 'uuidv4';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'contacts',
      [
        {
          id: uuid(),
          username: 'brogrammer',
          email: 'brogrammer@gmail.com',
          message: 'hello brother how are you doing my friend',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          username: 'John Doe',
          email: 'john@gmail.com',
          message: 'hello brother how are you doing my friend',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          username: 'Jean Doe',
          email: 'jean@gmail.com',
          message: 'hello brother how are you doing my friend',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          username: 'Mary Doe',
          email: 'mary@gmail.com',
          message: 'hello brother how are you doing my friend',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('contacts', null, {});
  },
};
