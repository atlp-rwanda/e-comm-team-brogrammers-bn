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
    static associate(models) {
      users.hasMany(models.notifications, { as: 'notifications', foreignKey: 'receiverId' });
      users.hasOne(models.carts, { as: 'cart', foreignKey: 'userId' });
      users.hasMany(models.order, { as: 'orders', foreignKey: 'buyerId' });
      users.hasMany(models.Chat, {
        foreignKey: 'userId',
        as: 'chats',
      });
      users.hasMany(models.Log, {
        foreignKey: 'userId',
        as: 'Log',
        onDelete: 'CASCADE',
      });
      users.hasMany(models.reviews, {
        as: 'reviews',
        foreignKey: 'productId',
      });
    }
  }
  users.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      avatar: {
        type: DataTypes.STRING(1000),
        defaultValue: 'https://t3.ftcdn.net/jpg/01/28/56/34/360_F_128563455_bGrVZnfDCL0PxH1sU33NpOhGcCc1M7qo.jpg'
      },
      cover_image: {
        type: DataTypes.STRING(1000),
        defaultValue: 'https://cdn.conceptartempire.com/images/360/01-concept-art-video-game-item-shop.jpg'
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'buyer',
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      email_token: {
        type: DataTypes.STRING,
        defaultValue: false,
      },
      gender: {
        type: DataTypes.STRING,
        defaultValue: 'none',
      },
      mfa_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      disabledUser: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      mfa_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      mfa_timeout: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      mustUpdatePassword: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastTimePasswordUpdated: {
        type: DataTypes.DATE,
        defaultValue: Date.now(),
      }
    },
    {
      sequelize,
      modelName: 'users',
    }
  );
  return users;
};
