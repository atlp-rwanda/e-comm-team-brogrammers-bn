/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orderitem', {
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      statusUpdated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      expectedDeliveryDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('orderitem');
  },
};
