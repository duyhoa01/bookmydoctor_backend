'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Status, { foreignKey: 'status_id', as: 'status' });
      this.belongsTo(models.Schedule, { foreignKey: 'schedule_id', as: 'schedule' });
      this.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
      this.belongsTo(models.Payment, { foreignKey: 'paymentId', as: 'payment' });
      this.hasMany(models.Notification, { foreignKey: 'appointment_id', as: 'notification' });
    }
  }
  Appointment.init({
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    schedule_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date:{
      type: DataTypes.DATE,
      allowNull: false
    },
    symptoms: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
  sequelize,
  modelName: 'Appointment',
});
return Appointment;
};