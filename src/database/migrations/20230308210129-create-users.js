/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      role: {
        defaultValue: 'buyer',
        type: Sequelize.STRING
      },
      gender: {
        defaultValue: 'none',
        type: Sequelize.STRING
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      email_token: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      mustUpdatePassword: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      lastTimePasswordUpdated: {
        type: Sequelize.DATE,
        defaultValue: Date.now()
      },
      resetPasswordToken: {
        type: Sequelize.STRING
      },
      resetPasswordExpires: {
        type: Sequelize.DATE
      },
      mfa_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      disabledUser: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('users');
  }
};
