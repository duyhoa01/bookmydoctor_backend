const router = require('express').Router();
const appointmentController = require('../controller/AppointmentController');
const authJwt = require('../middlewares/authJwt');

router.post('/', authJwt.authenToken, authJwt.isPatient, appointmentController.createAppointment);
router.get('/', authJwt.authenToken, authJwt.isAdmin, appointmentController.getAllAppointments);
router.get('/:id',authJwt.authenToken, appointmentController.getAppointmentById);
router.put('/confirm/:id/', authJwt.authenToken, authJwt.isDoctor, appointmentController.acceptAppointment);
router.get('/user/:id/', authJwt.authenToken, appointmentController.getAppointmentForUserByUserId);
router.put('/violate/:id/', authJwt.authenToken, authJwt.isAdmin, appointmentController.AdminHandlesAppointment);
router.put('/cancel/:id/', authJwt.authenToken, authJwt.isPatient, appointmentController.CanCelAppointment);
router.delete('/:id/', authJwt.authenToken, authJwt.isAdmin, appointmentController.deleteAppointment);
router.put('/report/:id/', authJwt.authenToken, appointmentController.ReportAppointment);
router.put('/rate/:id/', authJwt.authenToken, authJwt.isPatient, appointmentController.PatientRatingAppointment);


module.exports = router;