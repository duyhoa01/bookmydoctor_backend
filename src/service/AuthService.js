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
                    attributes: {
                        exclude: ['token']
                    },
                    raw: true,
                    nest: true,
                });
                if (user) {

                    let check = await bcrypt.compareSync(password, user.password);
                    if(!check) {
                        console.log(user.password);
                        userData.errCode = 4;
                        userData.errMessage = "Sai mật khẩu";
                    }
                    else {
                        if(user.status == 0){
                            userData.errCode = 5;
                            userData.errMessage = "Tài khoản chưa xác thực hoặc đã bị khóa";
                        }
                        else {

                            // Neu nguoi dung la doctor thi them cac thuoc tinh lien quan: chuyen khoa, benh vien, phong kham
                            if (user.role.name === "ROLE_DOCTOR") {
                                let doctor = await db.Doctor.findOne({
                                    include: {
                                        model: db.User,
                                        required: true,
                                        as : 'user',
                                        where: { id: user.id},
                                    },
                                    raw: true,
                                });
                                user.hospital_id = doctor.hospital_id;
                                user.clinic_id = doctor.clinic_id;
                                user.specialty_id = doctor.specialty_id;

                            }
                            userData.errCode = 0;
                            userData.errMessage = "0k";
        
                            delete user.password;
                            
                            userData.user = user;
                        }
                    }

                } else {
                    userData.errCode = 3;
                    userData.errMessage = "Tài khoản đã bị khóa";
                }

            } else {
                userData.errCode = 2;
                userData.errMessage = "Email không tồn tại"
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