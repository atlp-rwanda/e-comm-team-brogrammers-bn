/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      avatar: {
        type: Sequelize.STRING(1000),
        defaultValue: 'https://t3.ftcdn.net/jpg/01/28/56/34/360_F_128563455_bGrVZnfDCL0PxH1sU33NpOhGcCc1M7qo.jpg'
      },
      cover_image: {
        type: Sequelize.STRING(1000),
        defaultValue: 'https://cdn.conceptartempire.com/images/360/01-concept-art-video-game-item-shop.jpg'
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      role: {
        defaultValue: 'buyer',
        type: Sequelize.STRING,
      },
      gender: {
        defaultValue: 'none',
        type: Sequelize.STRING,
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      email_token: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      mustUpdatePassword: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      lastTimePasswordUpdated: {
        type: Sequelize.DATE,
        defaultValue: Date.now(),
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
      },
      resetPasswordExpires: {
        type: Sequelize.DATE,
      },
      mfa_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      disabledUser: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('users', { force: true, cascade: true });
  },
};
