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
                    message: 'email đã tồn tại'
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
                        address: data.address,
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

let AdminCreateUser = (data, roleName) => {
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
                        birthday: data.birthday,
                        address: data.address,
                        status: 1,
                        role_id: role.id,
                    },
                    
                )
                userData.errCode = 0;
                userData.errMessage = "OK";
                userData.user = user;
                
            } else {
                userData.errCode = 1;
                userData.errMessage = "email đã tồn tại";
            }
            resolve(userData);
        } catch (err) {
            reject(err);
        };
    });
}

let changePassword = (params,data) =>{
    return new Promise(async(resolve, reject) => {
        try{
            let user = await db.User.findByPk(params.id);
            if(user){
                let check = await bcrypt.compareSync(data.password, user.password);
                if(check){
                    let hashPasswordFromBcrypt = await hashUserPassword(data.newPassword);
                    db.User.update({
                        password: hashPasswordFromBcrypt
                    },{
                        where:{
                            id: params.id
                        }
                    })
                    resolve({
                        errCode: 0,
                        message: 'thay đổi mật khẩu thành công'
                    })
                } else{
                    resolve({
                        errCode: 4,
                        message: 'sai mật khẩu'
                    })
                }
            } else{
                resolve({
                    errCode: 2,
                    message: 'người dùng không tồn tại'
                })
            }
            
        } catch (e){
            reject(e)
        }
    })
}

let updateUser = (param,data) =>{
    return new Promise(async(resolve, reject) => {
        let resData = {};
        try{
            let user = await db.User.findByPk(param.id,
                {   attributes: {
                        exclude: ['password','token']
                    },
                });
            if(user) {
                await db.User.update({
                    birthday: data.birthday,
                    firsname: data.firsname,
                    lastname: data.lastname,
                    gender: data.gender === '1' ? true : false,
                    image: data.image !== '0' ? data.image : user.image,
                    gender: data.gender,
                    address: data.address,
                    phoneNumber: data.phoneNumber 
                },
                {
                    where:{
                        id: user.id
                    }
                } )
                let user1 = await db.User.findByPk(param.id,
                    {   attributes: {
                            exclude: ['password','token']
                        },
                        include: {
                            model: db.Role,
                            required: true,
                            as : 'role'
                        },
                    });
                resData.errCode = 0;
                resData.errMessage = user1
            }
            else {
                resData.errCode = 2;
                resData.errMessage = "mã bệnh nhân không tồn tại"
            }
            resolve(resData)
        } catch(e){
            reject(e);
        }
    });
}



module.exports = {
    checkUserEmail:checkUserEmail,
    hashUserPassword:hashUserPassword,
    buildUrlEmail:buildUrlEmail,
    createNewUser:createNewUser,
    verifyUser:verifyUser,
    AdminCreateUser: AdminCreateUser,
    changePassword,
    updateUser
}


