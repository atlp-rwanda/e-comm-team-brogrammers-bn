import { Model } from 'sequelize';

/**
 * exporting the user model and it's features.
 * @param {Object} sequelize
 * @param {Object} DataTypes
 * @returns {Object} the model for user
 */
export default (sequelize, DataTypes) => {
  // eslint-disable-next-line require-jsdoc
  class Subscriber extends Model {
    /**
     * Helper method for defining associations.
     * @param {*} _models
     * @returns {void}
     */
    static associate() {
      // define association here
    }
  }
  Subscriber.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Subscriber',
  });
  return Subscriber;
};