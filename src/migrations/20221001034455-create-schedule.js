'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Schedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      begin: {
        type: Sequelize.DATE,
        allowNull:false
      },
      end: {
        type: Sequelize.DATE,
        allowNull:false
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      status: {
        type:Sequelize.BOOLEAN,
        allowNull:false
      },
      cost: {
        type: Sequelize.DOUBLE,
        allowNull:false
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
    await queryInterface.dropTable('Schedules');
  }
};