const router = require('express').Router();
const authJwt = require('../middlewares/authJwt');
const paymentController = require('../controller/PaymentController');

router.get('/', authJwt.authenToken, authJwt.isAdmin, paymentController.getAllPayment);
router.get('/doctor/:id/info',authJwt.authenToken, authJwt.isAdminOrYourself, paymentController.doctorPayment);
router.get('/doctor/:id/list-payment',authJwt.authenToken, authJwt.isAdminOrYourself, paymentController.getPaymentOfDoctor);
router.get('/:id',authJwt.authenToken, paymentController.getPaymentById);
module.exports = router;