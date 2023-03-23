import bcrypt from 'bcrypt';
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
          username: 'Patience Ineza',
          email: 'inezapatience2@gmail.com',
          password: await bcrypt.hash('123@Pass', saltRounds),
          gender: 'none',
          role: 'admin',
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          username: 'John Doe',
          email: 'john@gmail.com',
          password: await bcrypt.hash('123@Pass', saltRounds),
          gender: 'male',
          role: 'seller',
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          username: 'Me Doe',
          email: 'admin@mail.com',
          password: await bcrypt.hash('123@Pass', saltRounds),
          gender: 'male',
          role: 'admin',
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          username: 'Me Doe',
          email: 'buyer@mail.com',
          password: await bcrypt.hash('123@Pass', saltRounds),
          gender: 'male',
          role: 'buyer',
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          username: 'Me Doe',
          email: 'seller@mail.com',
          password: await bcrypt.hash('123@Pass', saltRounds),
          gender: 'male',
          role: 'seller',
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          username: 'Jean Doe',
          email: 'jean@gmail.com',
          password: await bcrypt.hash('123@Pass', saltRounds),
          gender: 'female',
          role: 'seller',
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          username: 'Lucy Aisha',
          email: 'lucy@gmail.com',
          password: await bcrypt.hash('123@Pass', saltRounds),
          gender: 'female',
          role: 'seller',
          verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          username: 'Ange She',
          email: 'ange@gmail.com',
          password: await bcrypt.hash('123@Pass', saltRounds),
          gender: 'female',
          role: 'buyer',
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          username: 'Habihirwe',
          email: 'habiholivier10@gmail.com',
          password: await bcrypt.hash('123@Pass', saltRounds),
          gender: 'male',
          role: 'buyer',
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          username: 'olivier',
          email: 'mathematicstatistics1@gmail.com',
          password: await bcrypt.hash('123@Pass', saltRounds),
          gender: 'male',
          role: 'buyer',
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
