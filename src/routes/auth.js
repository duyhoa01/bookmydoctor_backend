const router = require('express').Router();

const authController = require('../controller/AuthController');
const fileUploader = require('../config/cloudinary.config');

router.route('/login').post(authController.handleLogin);
router.post('/singup',fileUploader.single('image'),authController.singup);
router.get('/verify-account',authController.verifyUser)

module.exports = router;
