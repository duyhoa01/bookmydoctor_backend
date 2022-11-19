const router = require('express').Router();
const momo = require('../controller/MomoPaymentController');


router.post('/', momo.Payment);
router.get('/return', momo.ReturnPayment);
router.post('/notify', momo.NotifyPayment);


module.exports = router;
