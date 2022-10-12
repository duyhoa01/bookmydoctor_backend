
const auth = require('./auth')
const express = require('express')
const router=express.Router()
const patient = require('./patient')
const doctor = require('./doctor')


router.get("/status",(req,res)=>{
    res.status(200).json({status:'ok'})
})


router.use('/auth',auth)

router.use('/user',auth)

router.use('/patients',patient)

router.use('/doctor',doctor)
module.exports = router;