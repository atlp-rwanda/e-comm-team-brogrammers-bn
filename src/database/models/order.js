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
        onDelete: 'cascade',
      });
      order.belongsTo(models.users, {
        as: 'buyer',
        foreignKey: 'buyerId',
        onDelete: 'cascade',
      });
      order.hasOne(models.payments, { as: 'payment', foreignKey: 'orderId' });
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
      orderNo: {
        type: DataTypes.FLOAT,
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
      status: {
        type: DataTypes.STRING,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
        defaultValue: 'Pending',
      },
      statusUpdated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      expectedDeliveryDate: {
        type: DataTypes.DATE,
        allowNull: true,
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
