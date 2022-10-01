'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Doctor, { foreignKey: 'doctor_id', as: 'doctor' });
      this.hasMany(models.Appointment, { foreignKey: 'schedule_id', as: 'appointments' })
    }
  }
  Schedule.init({
    currentNumber: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    maxnumber:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    timeslot: {
      type:DataTypes.STRING,
      allowNull:false
    },
    date: {
      type:DataTypes.DATE,
      allowNull:false
    },
    doctor_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    cost: {
      type:DataTypes.DOUBLE,
      allowNull:false
    },
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};