const router = require('express').Router();
const revenueController = require('../controller/RevenueController');
const authJwt = require('../middlewares/authJwt');

router.get('',authJwt.authenToken, authJwt.isAdmin,revenueController.getRevenue); 
router.get('/specialties',authJwt.authenToken, authJwt.isAdmin,revenueController.getRevenueOfSpecialty); 


module.exports = router;