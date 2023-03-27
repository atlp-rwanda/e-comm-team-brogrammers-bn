import { Model } from 'sequelize';

/**
 * exporting the user model and it's features.
 * @param {Object} sequelize
 * @param {Object} DataTypes
 * @returns {Object} the model for user
 */
export default (sequelize, DataTypes) => {
  // eslint-disable-next-line require-jsdoc
  class notifications extends Model {
    // eslint-disable-next-line valid-jsdoc
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      notifications.belongsTo(models.users, {
        as: 'receiver',
        foreignKey: 'receiverId',
      });
    }
    // define association here
  }
  notifications.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      receiverId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      message: DataTypes.STRING,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'notifications',
    }
  );
  return notifications;
};
