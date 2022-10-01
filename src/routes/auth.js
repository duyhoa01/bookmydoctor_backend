const express= require('express')
const router=express.Router()

const authController = require('../controller/AuthController');

router.post('/singup',authController.singup);
router.post('/singin',authController.signin);

module.exports = router