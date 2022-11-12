'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });    
      this.hasMany(models.Appointment, { foreignKey: 'patient_id', as: 'appointments' });
      this.hasMany(models.Rate, { foreignKey: 'patient_id', as: 'rates' });
      // this.hasMany(models.MessageChat, { foreignKey: 'patient_id', as: 'messageChat' });
    }
  }
  Patient.init({
    user_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Patient',
  });
  return Patient;
};