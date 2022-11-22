'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Doctors', 'paid', {
      type: Sequelize.DATE,
      allowNull:true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Doctors');
  }
};
