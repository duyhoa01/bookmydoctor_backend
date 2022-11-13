'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'followers');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
