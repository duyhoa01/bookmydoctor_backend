const router = require('express').Router();
const doctorController = require('../controller/DoctorController');
const authJwt = require('../middlewares/authJwt');
const fileUploader = require('../config/cloudinary.config');
router.get('/', doctorController.getAllDoctor);
router.get('/:id', doctorController.getDoctorById);
router.post('/', authJwt.authenToken, authJwt.isAdmin, fileUploader.single('image'), doctorController.createDoctor);
router.put('/:id', authJwt.authenToken, authJwt.isAdminOrYourself, fileUploader.single('image'), doctorController.updateDoctor);
router.delete('/:id', authJwt.authenToken, authJwt.isAdmin, doctorController.deleteDoctor);

// router.post('/', doctorController.createDoctor);
// router.post('/', doctorController.createDoctor);
// router.put('/:id', doctorController.updateDoctor);
// router.delete('/:id', doctorController.deleteDoctor);
module.exports = router;