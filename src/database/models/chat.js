/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.users.hasMany(Chat, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      Chat.belongsTo(models.users, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  Chat.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      room: {
        type: DataTypes.STRING,
        default: 'brogrammers',
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING(10000),
        allowNull: false,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'Chat',
    }
  );
  return Chat;
};
