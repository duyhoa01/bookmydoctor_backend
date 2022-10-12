const express= require('express')
const router=express.Router()

const authController = require('../controller/AuthController');
const fileUploader = require('../config/cloudinary.config');

router.post('/singup',fileUploader.single('image'),authController.singup);
router.get('/verify-account',authController.verifyUser)

module.exports = router