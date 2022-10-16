const express= require('express')
const router=express.Router()

const userController = require('../controller/UserController');
const fileUploader = require('../config/cloudinary.config');

router.post('/password/:id',userController.changePassword);

router.put('/:id',fileUploader.single('image'),userController.updateInforUser);

router.get('/resetpw/:id',userController.ResetPassword);


module.exports = router