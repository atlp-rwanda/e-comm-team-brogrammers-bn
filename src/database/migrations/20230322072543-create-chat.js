/* eslint-disable no-unused-vars */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chat', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      room: {
        type: Sequelize.STRING,
        default: 'brogrammers',
        allowNull: false
      },
      message: {
        type: Sequelize.STRING(10000),
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        isUUID: 4,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chat');
  }
};
