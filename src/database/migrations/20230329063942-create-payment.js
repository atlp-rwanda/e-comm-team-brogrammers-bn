/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      orderId: {
        type: Sequelize.UUID,
        references: {
          model: 'order',
          key: 'id'
        }
      },
      method: {
        type: Sequelize.STRING
      },
      discount: {
        type: Sequelize.DOUBLE,
        defaultValue: 0
      },
      stripeId: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('payments');
  }
};
