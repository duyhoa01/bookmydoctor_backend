'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Appointment, { foreignKey: 'status_id', as: 'appointments' })
    }
  }
  Status.init({
    name: {
      type:DataTypes.STRING,
      allowNull:false
    },
  }, {
    sequelize,
    modelName: 'Status',
  });
  return Status;
};