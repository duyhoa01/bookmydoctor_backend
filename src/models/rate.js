'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
      this.belongsTo(models.Doctor, { foreignKey: 'doctor_id', as: 'doctor' });
    }
  }
  Rate.init({
    doctor_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    text: {
      type:DataTypes.STRING,
      allowNull:false
    },
    rate: {
      type:DataTypes.FLOAT,
      allowNull:false
    },
    patient_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Rate',
  });
  return Rate;
};