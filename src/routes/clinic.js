const express= require('express')
const router=express.Router()

const clinicController = require('../controller/ClinicController');
const fileUploader = require('../config/cloudinary.config');
const authJwt = require('../middlewares/authJwt');


router.post('/', authJwt.authenToken, authJwt.isAdmin,fileUploader.single('image'),clinicController.createClinic);
router.get('/',clinicController.getAllClinic);
router.get('/search',clinicController.searchClinic);
router.get('/:id',clinicController.getClinicById);
router.delete('/:id', authJwt.authenToken, authJwt.isAdmin, clinicController.deleteClinic);
router.put('/:id',authJwt.authenToken, authJwt.isAdmin, fileUploader.single('image'),clinicController.updateClinic);

module.exports = router;