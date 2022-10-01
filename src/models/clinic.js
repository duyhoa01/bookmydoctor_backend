'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Doctor, { foreignKey: 'clinic_id', as: 'doctors' })
    }
  }
  Clinic.init({
    name: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    street: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    city: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    image: {
      type:DataTypes.STRING,
      allowNull:true,
    },
  }, {
    sequelize,
    modelName: 'Clinic',
  });
  return Clinic;
};