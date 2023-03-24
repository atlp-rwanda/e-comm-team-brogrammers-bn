import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  // eslint-disable-next-line require-jsdoc
  class order extends Model {
    // eslint-disable-next-line require-jsdoc
    static associate(models) {
      order.belongsToMany(models.products, {
        as: 'products',
        through: 'orderitem',
        foreignKey: 'orderId',
        onDelete: 'cascade'
      });
      order.belongsTo(models.users, { as: 'buyer', foreignKey: 'buyerId', onDelete: 'cascade' });
    }
  }
  order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      deliveryCountry: DataTypes.STRING,
      deliveryCity: DataTypes.STRING,
      deliveryStreet: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      paymentId: {
        type: DataTypes.UUID
      },
      status: {
        type: DataTypes.STRING,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
        defaultValue: 'Pending',
      },
      totalAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      buyerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'order',
    }
  );
  return order;
};
