const router = require('express').Router();
const doctorController = require('../controller/DoctorController');
const authJwt = require('../middlewares/authJwt');
const fileUploader = require('../config/cloudinary.config');
router.get('/revenue', authJwt.authenToken, authJwt.isAdmin,doctorController.getRevenueOfAllDoctors); 
router.get('/:id/revenue', authJwt.authenToken, authJwt.isAdminOrYourself,doctorController.getRevenueOfDoctor); 
router.get('/', doctorController.getAllDoctor);
router.get('/:id', doctorController.getDoctorById);
router.post('/', authJwt.authenToken, authJwt.isAdmin, fileUploader.single('image'), doctorController.createDoctor);
router.put('/:id', authJwt.authenToken, authJwt.isAdminOrYourself, fileUploader.single('image'), doctorController.updateDoctor);
router.delete('/:id', authJwt.authenToken, authJwt.isAdmin, doctorController.deleteDoctor);
router.get('/specialty/:id', doctorController.getDoctorBySpecialty);
router.get('/hospital/:id', doctorController.getDoctorByHospital); 

module.exports = router;