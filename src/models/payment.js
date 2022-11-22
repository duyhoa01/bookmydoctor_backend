'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Doctor, { foreignKey: 'doctor_id', as: 'doctor' }); 
      this.hasMany(models.Appointment, { foreignKey: 'paymentId', as: 'appointment' }); 
    }
  }
  Payment.init({
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    datePayment: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    monthlyFee: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    appointmentFee: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    totalPayment: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    monthly: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    transId: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};