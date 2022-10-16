const express= require('express')
const router=express.Router()

const specialtyController = require('../controller/SpecialtyController');
const fileUploader = require('../config/cloudinary.config');


router.post('',fileUploader.single('image'),specialtyController.addSpecialty);
router.put('/:id',fileUploader.single('image'),specialtyController.updateSpecialty);
router.get('',specialtyController.getAllSpecialty);
router.get('/:id',specialtyController.getSpecialtyById);
router.delete('/:id',specialtyController.deleteSpecialty);

module.exports = router