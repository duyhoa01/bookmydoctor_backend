const router = require('express').Router();
const authJwt = require('../middlewares/authJwt');
const notificationController = require('../controller/NotificationController');
router.put('/:id', authJwt.authenToken, notificationController.ChangeStatusNotifications);
router.get('/user/:id',authJwt.authenToken, authJwt.isAdminOrUser, notificationController.GetNotificationForUserByUserId);
module.exports = router;