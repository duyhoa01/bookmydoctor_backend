const router = require('express').Router()

const authController = require('../controller/AuthController');

router.route('/login').post(authController.handleLogin);
router.post('/singup',authController.upload,authController.singup);
router.get('/verify-account',authController.verifyUser)

module.exports = auth
