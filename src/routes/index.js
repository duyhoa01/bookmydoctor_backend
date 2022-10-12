
const auth = require('./auth')
const express = require('express')
const router=express.Router()
const patient = require('./patient')


router.get("/status",(req,res)=>{
    res.status(200).json({status:'ok'})
})


router.use('/auth',auth)
module.exports = router;


router.use('/auth',auth)
module.exports = router;

router.use('/user',auth)
module.exports = router;


router.use('/auth',auth)
module.exports = router;

router.use('/patients',patient)
module.exports = router;