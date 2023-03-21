import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  /**
   * class for model functions
   */
  class category extends Model {
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
  category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(2000),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'category',
    }
  );
  return category;
};
