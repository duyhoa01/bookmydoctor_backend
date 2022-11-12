'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MessageChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
      // this.belongsTo(models.Doctor, { foreignKey: 'doctor_id', as: 'doctor' });
      this.belongsTo(models.User, { foreignKey: 'from_user', as: 'fromUser' });
      this.belongsTo(models.User, { foreignKey: 'to_user', as: 'toUser' });
    }
  }
  MessageChat.init({
    from_user: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    to_user: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    text: {
      type:DataTypes.STRING,
      allowNull:true
    },
    image: {
      type:DataTypes.STRING,
      allowNull:true
    },
    date: {
      type:DataTypes.DATE,
      allowNull:false
    },
  }, {
    sequelize,
    modelName: 'MessageChat',
  });
  return MessageChat;
};