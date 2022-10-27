const express= require('express')
const router=express.Router()

const patientController = require('../controller/PatientController');
const fileUploader = require('../config/cloudinary.config');
const authJwt = require('../middlewares/authJwt')

router.post('/',authJwt.authenToken, authJwt.isAdmin,fileUploader.single('image'),patientController.addPatient);
router.get('',authJwt.authenToken,patientController.getPatients);
router.get('/:id',authJwt.authenToken,patientController.getPatientById);
router.delete('/:id',authJwt.authenToken, authJwt.isAdmin,patientController.deletePatientById);
router.put('/:id',authJwt.authenToken, authJwt.isAdminOrYourself,fileUploader.single('image'),patientController.updatePatient);
router.get('/user/:id',patientController.getIdPatientFromIdUser);


module.exports = router