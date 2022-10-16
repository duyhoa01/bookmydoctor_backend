const express= require('express')
const router=express.Router()

const patientController = require('../controller/PatientController');
const fileUploader = require('../config/cloudinary.config');
const authJwt = require('../middlewares/authJwt')

router.post('/',authJwt.authenToken, authJwt.isAdmin,fileUploader.single('image'),patientController.addPatient);
router.get('',patientController.getPatients);
router.get('/:id',patientController.getPatientById);
router.delete('/:id',patientController.deletePatientById);
router.put('/:id',fileUploader.single('image'),patientController.updatePatient);

module.exports = router