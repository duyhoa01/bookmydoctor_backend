'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firsname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gender: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      birthday: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      } ,
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      token: {
        type:Sequelize.STRING,
        allowNull:true
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
    await queryInterface.dropTable('Users');
  }
};