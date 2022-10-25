const express= require('express')
const router=express.Router()

const scheduleController = require('../controller/ScheduleController');
const authJwt = require('../middlewares/authJwt')

router.post('/',authJwt.authenToken,authJwt.isYourSelf_Doctor,scheduleController.addSchedule);
router.put('/:id',scheduleController.updateSchedule);
router.get('/',scheduleController.getListSchedule);
router.get('/:id',scheduleController.getScheduleBuId);
router.get('/doctor/:id',scheduleController.getListScheduleOfDoctor);
router.delete('/:id',scheduleController.deleteSchedule);

module.exports = router