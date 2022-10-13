const db = require('../models/index');
const userService = require('./UserService');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

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
                    attributes: ['email', 'password', 'role_id', 'firsname', 'lastname', 'status'],
                    raw: true
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

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let changePassword = (data) =>{
    return new Promise(async(resolve, reject) => {
        try{
            console.log(data)
            let userData = await handleUserLogin(data.email,data.password);
            console.log(userData.errCode)
            if ( userData.errCode == 0 ){
                let hashPasswordFromBcrypt = await hashUserPassword(data.newPassword);
                db.User.update({
                    password: hashPasswordFromBcrypt
                },{
                    where:{
                        email: data.email
                    }
                })
                resolve({
                    errCode: 0,
                    message: 'thay đổi mật khẩu thành công'
                })
            } else {
                resolve({
                    errCode: 4,
                    message: 'sai mật khẩu'
                })
            }
            
        } catch (e){
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    changePassword
}