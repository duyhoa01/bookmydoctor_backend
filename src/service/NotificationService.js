const db= require('../models');
const { Op, where } = require('sequelize');
let CreateNotification = (appointmentId, user_id, message) => {
    return new Promise(async(resolve, reject) => {
        try {
            let notification = await db.Notification.create({
                appointment_id: appointmentId,
                user_id: user_id,
                message: message,
                status: 0
            })
            resolve(notification)
        } catch (err) {
            reject(err)
        }
    });
}
let GetNotificationForUserByUserId = (id) => {
    return new Promise(async(resolve, reject) =>{
        try {
            let notification = await db.Notification.findAll({
                include: {
                    model: db.User,
                    required: true,
                    attributes: ['id'],
                    as: 'user',
                    where: {id: id}
                }
            })
            resolve(notification);
        } catch (err) {
            reject(err);
        }
    })
}
let deleteNotificationOfUserLastWeek = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let date = new Date();
            date.setDate(date.getDate() - 7);
            db.Notification.destroy({
                include: {
                    model: db.User,
                    required: true,
                    as: 'user',
                    where: {id: userId}
                },
                where: {createdAt: {[Op.lt]: date}}
            })
            resolve(true);
        } catch (err) {
            reject(err);
        }
    })
}
let ChangeStatusNotifications = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            await db.Notification.update({
                status: 1,
                where: {id: id}
            })
            resolve(true);
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