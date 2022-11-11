'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('MessageChats', 'collaborator_id');
    await queryInterface.addColumn('MessageChats', 'doctor_id', {
      type: Sequelize.INTEGER,
      allowNull:false
    });
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.dropTable('MessageChats');
  }
};
