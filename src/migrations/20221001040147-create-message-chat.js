'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MessageChats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      collaborator_id: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      text: {
        type: Sequelize.STRING,
        allowNull:true
      },
      image: {
        type: Sequelize.BLOB,
        allowNull:true
      },
      date: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('MessageChats');
  }
};