const router = require('express').Router();
const revenueController = require('../controller/RevenueController');
const authJwt = require('../middlewares/authJwt');

router.get('',authJwt.authenToken, authJwt.isAdmin,revenueController.getRevenue); 
router.get('/specialties',authJwt.authenToken, authJwt.isAdmin,revenueController.getRevenueOfSpecialty); 
router.get('/get-statistical-info', authJwt.authenToken, authJwt.isAdmin,revenueController.getStatisticalInfo)


module.exports = router;