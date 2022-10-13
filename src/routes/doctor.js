const router = require('express').Router();
const doctorController = require('../controller/DoctorController');
router.get('/get-all-doctor', doctorController.getAllDoctor);
router.get('', doctorController.getAllDoctor);
router.get('/get-doctor', doctorController.getDoctorById);
router.post('/create-doctor', doctorController.createDoctor);
router.put('/update-doctor', doctorController.updateDoctor);
router.delete('/delete-doctor', doctorController.deleteDoctor);
router.get('/get-doctor-by-specialty', doctorController.getDoctorBySpecialty);
module.exports = router;