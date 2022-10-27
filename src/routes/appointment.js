const router = require('express').Router();
const appointmentController = require('../controller/AppointmentController');
const authJwt = require('../middlewares/authJwt');

router.post('/', authJwt.authenToken, authJwt.isAdmin, appointmentController.createAppointment);
router.get('/', authJwt.authenToken, authJwt.isAdmin, appointmentController.getAllAppointments);
router.get('/:id',authJwt.authenToken, authJwt.isAdminOrUser, appointmentController.getAppointmentById);
router.put('/confirm/:id/', authJwt.authenToken, authJwt.isDoctor, appointmentController.acceptAppointment);
router.get('/user/:id/', authJwt.authenToken, authJwt.authenUser, appointmentController.getAppointmentForUserByUserId);
router.put('/done/:id/', authJwt.authenToken, authJwt.isAdmin, appointmentController.ChangeStatusAppointmentToDone);
router.put('/cancel/:id/', authJwt.authenToken, authJwt.isPatient, appointmentController.CanCelAppointment);
router.delete('/:id/', authJwt.authenToken, authJwt.isAdmin, appointmentController.deleteAppointment);

module.exports = router;