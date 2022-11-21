
const auth = require('./auth')
const express = require('express')
const router=express.Router()
const patient = require('./patient')
const doctor = require('./doctor')
const user = require('./user')
const clinic = require('./clinic')
const specialty = require('./specialty')
const hospital = require('./hospital')
const appointment = require('./appointment');
const schedule = require('./schedule')
const notification = require('./notification')
const messagechat = require('./mesagechat')
const paymentMomo = require('./paymentMomo');
const payment = require('./payment');




router.get("/status",(req,res)=>{
    res.status(200).json({status:'ok'})
})


router.use('/auth',auth)

router.use('/user',auth)

router.use('/patients',patient)

router.use('/doctor',doctor)

router.use('/users',user)

router.use('/clinic', clinic)
router.use('/specialty',specialty)
router.use('/hospital', hospital)
router.use('/appointment', appointment)
router.use('/schedule',schedule)
router.use('/notification',notification)
router.use('/messagechat',messagechat)
router.use('/payment-momo', paymentMomo)
router.use('/payment', payment)

module.exports = router;