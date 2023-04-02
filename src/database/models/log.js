/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.users.hasMany(Log, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      Log.belongsTo(models.users, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  Log.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    level: DataTypes.STRING,
    message: DataTypes.STRING,
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    metadata: DataTypes.JSON,
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'Log',
  });
  return Log;
};
