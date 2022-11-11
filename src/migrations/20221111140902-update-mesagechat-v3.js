'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('MessageChats', 'doctor_id');
    await queryInterface.removeColumn('MessageChats', 'patient_id');
    await queryInterface.addColumn('MessageChats', 'from_user', {
      type: Sequelize.INTEGER,
      allowNull:false
    });
    await queryInterface.addColumn('MessageChats', 'to_user', {
      type: Sequelize.INTEGER,
      allowNull:false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('MessageChats');
  }
};
