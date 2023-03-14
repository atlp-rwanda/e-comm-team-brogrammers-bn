/* eslint-disable arrow-body-style */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'users',
          'mfa_code',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'users',
          'mfa_timeout',
          {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: true,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('users', 'mfa_code', { transaction: t }),
        queryInterface.removeColumn('users', 'mfa_timeout', { transaction: t }),
      ]);
    });
  },
};
