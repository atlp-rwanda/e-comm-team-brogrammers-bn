import { Model } from 'sequelize';

/**
 * exporting the user model and it's features.
 * @param {Object} sequelize
 * @param {Object} DataTypes
 * @returns {Object} the model for user
 */
export default (sequelize, DataTypes) => {
  // eslint-disable-next-line require-jsdoc
  class carts extends Model {
    // eslint-disable-next-line valid-jsdoc
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      carts.belongsTo(models.users, { as: 'owner', foreignKey: 'userId' });
    }
  }
  carts.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      products: DataTypes.ARRAY(DataTypes.JSONB),
      total: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'carts',
    }
  );
  // eslint-disable-next-line no-undef
  return carts;
};
