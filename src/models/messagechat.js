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
      this.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
      this.belongsTo(models.Collaborator, { foreignKey: 'collaborator_id', as: 'collaborator' });
    }
  }
  MessageChat.init({
    collaborator_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    patient_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    text: {
      type:DataTypes.STRING,
      allowNull:true
    },
    image: {
      type:DataTypes.BLOB,
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