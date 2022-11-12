const express= require('express')
const router=express.Router()

const messageController = require('../controller/MessagechatController');
const fileUploader = require('../config/cloudinary.config');
const authJwt = require('../middlewares/authJwt')

router.post('/',fileUploader.single('image'),messageController.addMessage);
router.get('/',messageController.getListMessageChat);


module.exports = router