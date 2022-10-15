const db = require('../models/index');
const userService = require('./UserService');
const bcrypt = require('bcryptjs');

let handleUserLogin = (email, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email);
            if (isExist){
                let user = await db.User.findOne({
                    include: {
                        model: db.Role,
                        required: true,
                        as : 'role'
                    },
                    where: { email: email},
                    attributes: ['email', 'password', 'role_id', 'firsname', 'lastname', 'status', 'id'],
                    raw: false
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if(!check) {
                        // console.log(pass);
                        console.log(user.password);
                        userData.errCode = 4;
                        userData.errMessage = "Sai mat khau";
                    }
                    else {
                        if(user.status == 0){
                            userData.errCode = 5;
                            userData.errMessage = "Tai khoan chua xac thuc hoac da bi khoa";
                        }
                        else {
                            userData.errCode = 0;
                            userData.errMessage = "0k";
        
                            delete user.password;
                            userData.user = user;
                        }
                    }

                } else {
                    userData.errCode = 3;
                    userData.errMessage = "Tai khoan da bi khoa";
                }

            } else {
                userData.errCode = 2;
                userData.errMessage = "Ten nguoi dung khong ton tai"
            }
            
            resolve(userData);
        } catch(e) {
            reject(e);
        }
    })
}
let checkUserEmail = (email) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email: email}
            })
            if (user) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
}



module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
}