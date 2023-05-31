const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  // eslint-disable-next-line require-jsdoc
  class Blockedtoken extends Model {
    // eslint-disable-next-line valid-jsdoc
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Blockedtoken.init({
    token: DataTypes.STRING(10000)
  }, {
    sequelize,
    modelName: 'Blockedtoken',
  });
  return Blockedtoken;
};
