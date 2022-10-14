const express= require('express')
const router=express.Router()

const specialtyController = require('../controller/SpecialtyController');
const fileUploader = require('../config/cloudinary.config');


router.post('',fileUploader.single('image'),specialtyController.addSpecialty);
router.get('',specialtyController.getAllSpecialty);

module.exports = router