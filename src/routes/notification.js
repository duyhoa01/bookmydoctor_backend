const router = require('express').Router();
const authJwt = require('../middlewares/authJwt');
const notificationController = require('../Controller/NotificationController');
router.put('/:id', authJwt.isAdminOrUser, notificationController.ChangeStatusNotifications);
router.get('/user/:id', notificationController.GetNotificationForUserByUserId);
module.exports = router;