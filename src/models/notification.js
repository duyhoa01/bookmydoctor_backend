'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' }); 
      this.belongsTo(models.Appointment, { foreignKey: 'appointment_id', as: 'appointment' });
    }
  }
  Notification.init({
    appointment_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    user_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    message: DataTypes.STRING,
    status: {
      type:DataTypes.BOOLEAN,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};