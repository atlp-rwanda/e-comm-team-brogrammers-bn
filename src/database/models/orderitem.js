import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  /**
   * Order Item
   */
  class orderitem extends Model {
    // eslint-disable-next-line require-jsdoc
    static associate(models) {
      // define association here

      orderitem.belongsTo(models.products, {
        as: 'product',
        foreignKey: 'productId',
      });
      orderitem.belongsTo(models.order, { as: 'order', foreignKey: 'orderId' });
    }
  }
  orderitem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      statusUpdated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      expectedDeliveryDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'orderitem',
      timestamps: false,
    }
  );
  return orderitem;
};
