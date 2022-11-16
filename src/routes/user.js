const express= require('express')
const router=express.Router()

const userController = require('../controller/UserController');
const fileUploader = require('../config/cloudinary.config');
const authJwt = require('../middlewares/authJwt')

router.get('/:id/userchat',userController.getListUserChatWithUser);

router.post('/password/:id',authJwt.authenToken, authJwt.isAdminOrUser,userController.changePassword);

router.put('/:id',authJwt.authenToken, authJwt.isAdminOrUser,fileUploader.single('image'),userController.updateInforUser);

router.post('/resetpw',userController.ResetPassword);

router.get('/enable/:id',authJwt.authenToken, authJwt.isAdmin,userController.enableUser);

router.get('/disable/:id',authJwt.authenToken, authJwt.isAdmin,userController.disableUser);

router.get('/:id',authJwt.authenToken, userController.getUserById);


module.exports = router