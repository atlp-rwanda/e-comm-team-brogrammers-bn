import bcrypt from 'bcrypt';
import env from 'dotenv';

env.config();

const saltRounds = Number(process.env.SALTROUNDS);

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        username: 'Jean Luca',
        email: 'luca@gmail.com',
        password: await bcrypt.hash('123@Pass', saltRounds),
        gender: 'none',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'John Doe',
        email: 'john@gmail.com',
        password: await bcrypt.hash('123@Pass', saltRounds),
        gender: 'male',
        role: 'seller',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'Lucy Aisha',
        email: 'lucy@gmail.com',
        password: await bcrypt.hash('123@Pass', saltRounds),
        gender: 'female',
        role: 'seller',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'Ange She',
        email: 'ange@gmail.com',
        password: await bcrypt.hash('123@Pass', saltRounds),
        gender: 'female',
        role: 'buyer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  }
}