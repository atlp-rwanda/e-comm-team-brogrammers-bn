import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  /**
   * payment
   */
  class payment extends Model {
    /**
     * @param {*} models
     * @returns {null} empty
     */
    static associate(models) {
      payment.belongsTo(models.order, { as: 'order', foreignKey: 'orderId', onDelete: 'cascade' });
    }
  }
  payment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    method: DataTypes.STRING,
    discount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    stripeId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'payments',
  });
  return payment;
};
