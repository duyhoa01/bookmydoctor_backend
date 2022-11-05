const notificationService = require('../service/NotificationService');
let ChangeStatusNotifications = async(req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            errCode: "1",
            errMessage: "Thiếu tham số id"
        })
    }
    let resData = await notificationService.ChangeStatusNotifications(id, req.userID);
    if(resData.errCode === 0){
        return res.status(200).json({message: resData.message});
    }
    if(resData.errCode === 1){
        return res.status(200).json({message: resData.message});
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