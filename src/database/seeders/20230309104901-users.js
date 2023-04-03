import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import env from 'dotenv';
// eslint-disable-next-line import/no-extraneous-dependencies
import { uuid } from 'uuidv4';

env.config();

const saltRounds = Number(process.env.SALTROUNDS);

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: uuid(),
          avatar: faker.image.avatar(),
          cover_image: faker.image.imageUrl(),
          username: 'brogrammer',
          email: 'brogrammer@gmail.com',
          password: await bcrypt.hash('123@Pass', saltRounds),
          gender: 'none',
          role: 'admin',
          verified: true,
          createdAt: faker.date.past(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          avatar: faker.image.avatar(),
          cover_image: faker.image.imageUrl(),
          username: 'John Doe',
          email: 'john@gmail.com',
          password: await bcrypt.hash('123@Pass', saltRounds),
          gender: 'male',
          role: 'seller',
          verified: true,
          createdAt: faker.date.past(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          avatar: faker.image.avatar(),
          cover_image: faker.image.imageUrl(),
          username: 'Jean Doe',
          email: 'jean@gmail.com',
          password: await bcrypt.hash('123@Pass', saltRounds),
          gender: 'female',
          role: 'seller',
          verified: true,
          createdAt: faker.date.past(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          avatar: faker.image.avatar(),
          cover_image: faker.image.imageUrl(),
          username: 'Mary Doe',
          email: 'mary@gmail.com',
          password: await bcrypt.hash('123@Pass', saltRounds),
          gender: 'female',
          role: 'buyer',
          verified: true,
          createdAt: faker.date.past(),
          updatedAt: new Date(),
        }
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
