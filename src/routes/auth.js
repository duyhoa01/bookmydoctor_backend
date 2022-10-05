const express= require('express')
const router=express.Router()

const authController = require('../controller/AuthController');

router.post('/singup',authController.upload,authController.singup);
router.get('/verify-account',authController.verifyUser)

module.exports = router