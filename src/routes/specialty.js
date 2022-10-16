const express= require('express')
const router=express.Router()

const specialtyController = require('../controller/SpecialtyController');
const fileUploader = require('../config/cloudinary.config');
const authJwt = require('../middlewares/authJwt')


router.post('',authJwt.authenToken, authJwt.isAdmin,fileUploader.single('image'),specialtyController.addSpecialty);
router.put('/:id',authJwt.authenToken, authJwt.isAdmin,fileUploader.single('image'),specialtyController.updateSpecialty);
router.get('',specialtyController.getAllSpecialty);
router.get('/:id',specialtyController.getSpecialtyById);
router.delete('/:id',authJwt.authenToken, authJwt.isAdmin,specialtyController.deleteSpecialty);

module.exports = router