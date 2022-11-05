const express= require('express')
const router=express.Router()

const scheduleController = require('../controller/ScheduleController');
const authJwt = require('../middlewares/authJwt')

router.post('/',authJwt.authenToken,authJwt.isYourSelf_Doctor,scheduleController.addSchedule);
router.put('/:id',authJwt.authenToken,authJwt.isDoctor_Schedule,scheduleController.updateSchedule);
router.get('/',scheduleController.getListSchedule);
router.get('/:id',scheduleController.getScheduleBuId);
router.get('/doctor/:id',scheduleController.getListScheduleOfDoctor);
router.delete('/:id',authJwt.authenToken,authJwt.isAdminOrYourSelf_Doctor,scheduleController.deleteSchedule);
router.post('/multi',authJwt.authenToken,authJwt.isYourSelf_Doctor,scheduleController.addScheduleMultiDate)

module.exports = router