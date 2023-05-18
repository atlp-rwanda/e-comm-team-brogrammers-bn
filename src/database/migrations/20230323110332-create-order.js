/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order', {
      deliveryCountry: { type: Sequelize.STRING, allowNull: false },
      deliveryCity: { type: Sequelize.STRING, allowNull: false },
      deliveryStreet: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      buyerId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      orderNo: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      paymentMethod: {
        type: Sequelize.STRING,
      },
      isPaid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
        defaultValue: 'Pending',
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
      totalAmount: {
        type: Sequelize.DECIMAL,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('order');
  },
};
