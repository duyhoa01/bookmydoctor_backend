const express= require('express')
const router=express.Router()

const hospitalController = require('../controller/HospitalController');
const fileUploader = require('../config/cloudinary.config');
const authJwt = require('../middlewares/authJwt');


router.post('/', authJwt.authenToken, authJwt.isAdmin,fileUploader.single('image'),hospitalController.createHospital);
router.get('/',hospitalController.getAllHospital);
router.get('/search',hospitalController.searchHospital);
router.get('/:id',hospitalController.getHospitalById);
router.delete('/:id', authJwt.authenToken, authJwt.isAdmin, hospitalController.deleteHospital);
router.put('/:id',authJwt.authenToken, authJwt.isAdmin, fileUploader.single('image'),hospitalController.updateHospital);

module.exports = router;