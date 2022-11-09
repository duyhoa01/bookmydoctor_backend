const emailService = require('./emailService');
const userService = require('./UserService');
const db = require('../models/index');
let HandleViolation = async(userId, message) => {
    let user = await db.User.findByPk(userId);
    if (user.violation === null) {
        user.violation = 0;
    }
    user.violation ++;
    await user.save();
    if (user.violation >= 3) {
        message = message + '. Bạn đã vi phạm quá 2 lần. Tài khoản của bạn đã bị khóa!';
        let dataSend = {
            receiverEmail: user.email,
            message: message
        }
        emailService.sendNotification(dataSend);
        let data = {
            id : userId,
        }
        userService.disableUser(data);
    }
    console.log(user.violation);
    return user.violation;
}
module.exports = {
    HandleViolation
}