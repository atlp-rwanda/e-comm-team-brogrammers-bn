'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
 async up(queryInterface, Sequelize) {
  await queryInterface.createTable('Subscribers', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
    },
    firstName: {
      allowNull: false,
      type: Sequelize.STRING
    },
    lastName: {
      allowNull: false,
      type: Sequelize.STRING
    },
    email: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING,
    },
    isConfirmed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
},
async down(queryInterface) {
  await queryInterface.dropTable('Subscribers');
}
};