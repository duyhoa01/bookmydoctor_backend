const auth= require('express').Router()

const authController = require('../controller/AuthController');

auth.route('/signup').post(authController.singup);
auth.route('/login').post(authController.handleLogin);

module.exports = auth
