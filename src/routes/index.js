// const authRouter= require('./auth')
const auth = require('./auth')
const doctor = require('./doctor')
const express = require('express')
const router=express.Router()

router.get("/status",(req,res)=>{
res.status(200).json({status:'ok'})
})

router.use('/auth',auth)
module.exports = router;

router.use('/user',auth)
module.exports = router;

router.use('/doctor',doctor)
module.exports = router;