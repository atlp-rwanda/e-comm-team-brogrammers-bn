module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'verified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'verified');
  }
};
