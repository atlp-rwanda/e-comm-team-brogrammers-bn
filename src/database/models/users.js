import { Model } from 'sequelize';

/**
 * exporting the user model and it's features.
 * @param {Object} sequelize
 * @param {Object} DataTypes
 * @returns {Object} the model for user
 */
export default (sequelize, DataTypes) => {
  // eslint-disable-next-line require-jsdoc
  class users extends Model {
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
  users.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'buyer'
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    email_token: {
      type: DataTypes.STRING,
      defaultValue: false
    },
    gender: {
      type: DataTypes.STRING,
      defaultValue: 'none'
    },
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};
