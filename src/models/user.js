'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
      this.hasOne(models.Doctor,{foreignKey:'user_id',as:'doctor'})
      this.hasOne(models.Patient,{foreignKey:'user_id',as:'patient'})
      this.hasOne(models.Collaborator,{foreignKey:'user_id',as:'collaborator'})
      this.hasOne(models.Admin,{foreignKey:'user_id',as:'admin'})
      this.hasMany(models.Notification,{foreignKey:'user_id',as:'notification'})
      this.hasMany(models.MessageChat, { foreignKey: 'from_user', as: 'SendmessageChat' });
      this.hasMany(models.MessageChat, { foreignKey: 'to_user', as: 'GetmessageChat' });
      this.hasOne(models.Comment,{foreignKey:'user_id',as:'comment'})
    }
    // toJSON(){
    //   return {...this.get(), password: undefined}
    // }
  }
  User.init({
    email:{
      type: DataTypes.STRING,
      allowNull: false,
    } ,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    } ,
    firsname: {
      type: DataTypes.STRING,
      allowNull: false,
    } ,
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    } ,
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    } ,
    gender: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    } ,
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    } ,
    birthday: {
      type: DataTypes.DATE,
      allowNull: true,
    } ,
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    } ,
    status: {
      type:DataTypes.BOOLEAN,
      allowNull:true,
    },
    role_id: {
      type:DataTypes.INTEGER,
      allowNull:true
    },
    token: {
      type:DataTypes.STRING,
      allowNull:true
    },
    violation: {
      type:DataTypes.INTEGER,
      allowNull:true
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};