const bcrypt = require('bcryptjs');
const db = require('../models');
const emailService = require('./emailService')
const { v4: uuidv4 } = require('uuid')

const salt = bcrypt.genSaltSync(10);


let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    email: userEmail
                }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error);
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

let buildUrlEmail= (token) =>{
    let result = `${process.env.HOST_BASE}/api/auth/verify-account?token=${token}` 
    return result;
}

let createNewUser = async (data, roleName) => {
    return new Promise(async (resolve, reject) => {
        try {

            //check email is exist?
            let checkemail = await checkUserEmail(data.email);
            if (checkemail === true) {
                resolve({
                    errCode: 1,
                    message: 'email da ton tai'
                })
            } else {
                let id='';
                if(data.status == '0'){
                    id= uuidv4();
                    await emailService.sendSimpleEmail({
                        receiverEmail: data.email,
                        patientName:data.lastname,
                        redirectLink:buildUrlEmail(id)
                    });
                }

                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                let [role, created] = await db.Role.findOrCreate({
                    where: { name: roleName }
                })
                const user = await db.User.create(
                    {
                        email: data.email,
                        password: hashPasswordFromBcrypt,
                        firsname: data.firsname,
                        lastname: data.lastname,
                        image: data.image,
                        gender: data.gender === '1' ? true : false,
                        phoneNumber: data.phoneNumber,
                        birthday: data.birthday,
                        status: data.status,
                        role_id: role.id,
                        token: id
                    }
                )

                resolve({
                    errCode: 0,
                    message: user
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}

let verifyUser = (data)=>{
    return new Promise( async (resolve,reject)=>{
        try {
            if(!data.token){
                resolve({
                    errCode:1,
                    errMessage:'Loi token'
                })
            } else{
                let user=await db.User.findOne({
                    where:{
                        token: data.token,
                        status: 0
                    },
                    raw: false
                })

                if(user){
                    user.status = true
                    user.token = ''
                    await user.save()

                    resolve({
                        errCode:0,
                        errMessage: 'Xac thuc thanh cong'
                    })
                } else {
                    resolve({
                        errCode:2,
                        errMessage: 'Tai khoan da duoc kich hoat hoac khong ton tai'
                    })
                }

            }
        } catch (e) {
            reject(e)
        }
    })
} 

let createUser = (data, roleName) => {
    return new Promise(async(resolve, reject) => {
        let userData = {};
        try {
            let check = await checkUserEmail(data.email);
            if(!check) {
                let [role, created] = await db.Role.findOrCreate({
                    where: { name: roleName }
                });
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                const user = await db.User.create(
                    {
                        email: data.email,
                        password: hashPasswordFromBcrypt,
                        firsname: data.firsname,
                        lastname: data.lastname,
                        image: data.image,
                        gender: data.gender === '1' ? true : false,
                        phoneNumber: data.phoneNumber,
                        age: data.age,
                        status: data.status,
                        role_id: role.id,
                    },
                    
                )
                userData.errCode = 0;
                userData.errMessage = "Ok";
                userData.user = user;
                
            } else {
                userData.errCode = 1;
                userData.errMessage = "email da ton tai";
            }
            resolve(userData);
        } catch (err) {
            reject(err);
        };
    });
}


module.exports = {
    checkUserEmail:checkUserEmail,
    hashUserPassword:hashUserPassword,
    buildUrlEmail:buildUrlEmail,
    createNewUser:createNewUser,
    verifyUser:verifyUser,
    createUser: createUser
}


