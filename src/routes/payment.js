const router = require('express').Router();

const paymentController = require('../controller/PaymentController');

router.post('/doctor/:id', paymentController.doctorPayment);

module.exports = router;