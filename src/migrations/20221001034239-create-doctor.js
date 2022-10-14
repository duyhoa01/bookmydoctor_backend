'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Doctors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING,
        allowNull:true,
      },
      rate: {
        type: Sequelize.FLOAT
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
      },
      hospital_id: {
        type: Sequelize.INTEGER,
        allowNull:true,
      },
      clinic_id: {
        type: Sequelize.INTEGER,
        allowNull:true,
      },
      specialty_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Doctors');
  }
};