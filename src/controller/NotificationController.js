const notificationService = require('../service/NotificationService');
let ChangeStatusNotifications = async(req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            errCode: "1",
            errMessage: "Thiếu tham số id"
        })
    }
    let check = await notificationService.ChangeStatusNotifications(id);
    if(check){
        return res.status(200).json({message: 'OK'});
    }
}
let GetNotificationForUserByUserId = async(req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            errCode: "1",
            errMessage: "Thiếu tham số id"
        })
    }
    let notification = await notificationService.GetNotificationForUserByUserId(id);
    return res.status(200).json({message: notification});
}
module.exports = {
    ChangeStatusNotifications,
    GetNotificationForUserByUserId
}