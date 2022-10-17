const express= require('express')
const router=express.Router()

const userController = require('../controller/UserController');
const fileUploader = require('../config/cloudinary.config');
const authJwt = require('../middlewares/authJwt')

router.post('/password/:id',authJwt.authenToken, authJwt.isAdminOrUser,userController.changePassword);

router.put('/:id',authJwt.authenToken, authJwt.isAdminOrUser,fileUploader.single('image'),userController.updateInforUser);

router.post('/resetpw',userController.ResetPassword);


module.exports = router