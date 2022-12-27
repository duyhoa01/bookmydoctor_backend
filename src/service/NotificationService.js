const db = require('../models');
const { Op, where } = require('sequelize');
let CreateNotification = (appointmentId, user_id, message) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notification = await db.Notification.create({
                appointment_id: appointmentId,
                user_id: user_id,
                message: message,
                status: 0,
            })
            resolve(notification)
        } catch (err) {
            reject(err)
        }
    });
}
let GetNotificationForUserByUserId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notification = await db.Notification.findAll({
                include: {
                    model: db.User,
                    required: true,
                    attributes: ['id'],
                    as: 'user',
                    where: { id: id }
                },
                order: [
                    ['id', 'DESC']
                ],
            })
            resolve(notification);
        } catch (err) {
            reject(err);
        }
    })
}
let deleteNotificationOfUserLastWeek = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let date = new Date();
            date.setDate(date.getDate() - 7);
            db.Notification.destroy({
                include: {
                    model: db.User,
                    required: true,
                    as: 'user',
                    where: { id: userId }
                },
                where: {
                    status: true,
                    createdAt: { [Op.lt]: date } }
            })
            resolve(true);
        } catch (err) {
            reject(err);
        }
    })
}
let ChangeStatusNotifications = (id, userID) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resData = {};
            let notification = await db.Notification.update({
                status: 1,
            },
                {
                    where: { id: id, user_id: userID }
                }
            )
            if (!notification) {
                resData.errCode = 1;
                resData.message = 'Không tồn tại thông báo có id này';
            }
            resData.errCode = 0;
            resData.message = 'OK';

            resolve(resData);
        } catch (err) {
            reject(err);
        }
    })
}
module.exports = {
    CreateNotification,
    GetNotificationForUserByUserId,
    deleteNotificationOfUserLastWeek,
    ChangeStatusNotifications
}