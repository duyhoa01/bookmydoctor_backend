'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Specialty, { foreignKey: 'specialty_id', as: 'specialty' });
      this.belongsTo(models.Hospital, { foreignKey: 'hospital_id', as: 'hospital' });
      this.belongsTo(models.Clinic, { foreignKey: 'clinic_id', as: 'clinic' });
      this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      this.hasMany(models.Schedule, { foreignKey: 'doctor_id', as: 'schedules' });
      this.hasMany(models.Rate, { foreignKey: 'doctor_id', as: 'rates' });
      this.hasOne(models.Comment,{foreignKey:'doctor_id',as:'comment'});
      this.hasOne(models.Payment,{foreignKey:'doctor_id',as:'payment'});
    }
  }
  Doctor.init({
    description: {
      type:DataTypes.STRING,
      allowNull:true,
    },
    rate: DataTypes.FLOAT,
    user_id: {
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    hospital_id: {
      type:DataTypes.INTEGER,
      allowNull:true,
    },
    clinic_id: {
      type:DataTypes.INTEGER,
      allowNull:true,
    },
    specialty_id: {
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    numberOfReviews: {
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    paid: {
      type: DataTypes.DATE,
      allowNull:true,
    }
  }, {
    sequelize,
    modelName: 'Doctor',
  });
  return Doctor;
};