'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      this.belongsTo(models.Doctor, { foreignKey: 'doctor_id', as: 'doctor' });
    }
  }
  Comment.init({
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    content: {
      type: DataTypes.STRING,
      allowNull:false
    },
    reply_id: {
      type: DataTypes.INTEGER,
      allowNull:true
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};