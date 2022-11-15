const bcrypt = require('bcryptjs');
const db = require('../models');
const emailService = require('./emailService')
const { v4: uuidv4 } = require('uuid');
const { where } = require('sequelize');
const { Op,QueryTypes } = require('sequelize');

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
                        token: id,
                        violation: 0
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
                        violation: 0
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

let ResetPassword = (data) =>{
    return new Promise( async (resolve, reject)=>{
        try{
            let user = await db.User.findOne({
                where:{
                    email: data.email
                }
            })
            if(user){
                let newPaw= Math.floor(Math.random() * 100000000)+'';
                let hashPasswordFromBcrypt = await hashUserPassword(newPaw);
                user.password = hashPasswordFromBcrypt;
                await db.User.update({
                    password: hashPasswordFromBcrypt
                },
                {
                    where:{
                        email:data.email
                    }
                })
                await emailService.sendEmailToResetPw({
                    receiverEmail: user.email,
                    patientName:user.lastname,
                    newPassword:newPaw
                });
                resolve({
                    errCode:0,
                    message:'truy cập email để xem password'
                })
            } else{
                resolve({
                    errCode:2,
                    message:'người dùng không tồn tại'
                })
            }
        } catch( e){
            reject(e)
        }
       
    })
}

let enableUser = async (data) =>{
    return new Promise( async (resolve, reject)=>{
        try{
            let user = await db.User.findByPk(data.id)
            if(user){
                if( user.status == 0 ){
                    user.status = 1;
                    await user.save();

                    resolve({
                        errCode:0,
                        message:'mở khóa thành công người dùng'
                    })
                } else {
                    resolve({
                        errCode:4,
                        message:'người dùng này đã được mở khóa trước đó'
                    })
                }
            } else{
                resolve({
                    errCode:2,
                    message:'người dùng không tồn tại'
                })
            }
        } catch( e){
            reject(e)
        }
       
    })
}

let disableUser = async (data) => {
    return new Promise( async (resolve, reject)=>{
        try{
            let user = await db.User.findByPk(data.id)
            if(user){
                if( user.status == 1 ){
                    user.status = 0;
                    await user.save();

                    resolve({
                        errCode:0,
                        message:'khóa thành công người dùng'
                    })
                } else {
                    resolve({
                        errCode:4,
                        message:'người dùng này đã được khóa trước đó'
                    })
                }
            } else{
                resolve({
                    errCode:2,
                    message:'người dùng không tồn tại'
                })
            }
        } catch( e){
            reject(e)
        }
       
    })
}

let getListUserChatWithUser= async (data) => {
    return new Promise( async (resolve, reject)=>{
        try{
            await db.sequelize.query("SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'");
            let users  = await db.sequelize.query("select from_user, to_user from MessageChats where to_user = :user_id or from_user=:user_id ORDER BY date DESC;",
                            { replacements: { user_id: data.id },type: QueryTypes.SELECT });
            let arrUsers = Array.from(users);
            let arr =[]
            for( let a of arrUsers){
                if(a.from_user==data.id){
                    arr.push(a.to_user);
                } else{
                    arr.push(a.from_user);
                }
            }
            if(arr.length == 0){
                return resolve({
                    errorCode:0,
                    users: []
                })
            }  
            uniq = [...new Set(arr)];
            // console.log(uniq)
            // let listUsers = await db.User.findAll({
            //     where:{
            //         id: {
            //             [Op.in]: uniq
            //         } 
            //     },
            //     include:[
            //         {
            //             model: db.Role,
            //             required: true,
            //             as: 'role'
            //         } ,
            //         {
            //             model: db.MessageChat,
            //             required: true,
            //             as: 'SendmessageChat',
            //             where:{
            //                 to_user: data.id
            //             },
            //             limit: 1,
            //             order: [
            //                 ['date', 'DESC']
            //             ],
            //             attributes: {
            //                 exclude: ['collaborator_id']
            //             },
            //         } ,
            //         {
            //             model: db.MessageChat,
            //             required: true,
            //             as: 'GetmessageChat',
            //             where:{
            //                 from_user: data.id
            //             },
            //             limit: 1,
            //             order: [
            //                 ['date', 'DESC']
            //             ],
            //             attributes: {
            //                 exclude: ['collaborator_id']
            //             },
            //         } 
            //     ],
            //     attributes: {
            //         exclude: ['password', 'token']
            //     }, 
            // })
            let sql ="select * from (select p1.id,p1.email,p1.firsname, p1.lastname, p1.image,p1.gender,p1.phoneNumber,p1.birthday,p1.address,p1.status,p1.role_id, m.id as 'message.id' ,m.date as 'message.date', m.from_user as 'message.from_user', m.text as 'message.text', m.image as 'message.image' ,m.to_user as 'message.to_user',ROW_NUMBER() OVER(PARTITION BY p1.id ) rn from (select * from Users u where id in (:uniq)) p1 INNER JOIN MessageChats m ON (m.to_user = :user_id and m.from_user = p1.id) or ( m.from_user = :user_id and m.to_user = p1.id) ORDER BY m.date DESC) a WHERE rn = 1; ";
            let listUsers = await db.sequelize.query(sql,{ replacements: { uniq: uniq, user_id: data.id },type: QueryTypes.SELECT })
            return resolve({
                errorCode:0,
                users: listUsers
            })
        }catch(e){
            reject(e)
        }
    });
}

let getUserById = async (data) => {
    return new Promise( async (resolve, reject)=>{
        try{
            let user = await db.User.findByPk(data.id,{
                include:
                {
                    model: db.Role,
                    required: true,
                    as: 'role'
                } ,
            })
            if(!user){
                return resolve({
                    errCode:2,
                    message:'mã người dùng không tồn tại'
                })
            } else{
                return resolve({
                    errCode:0,
                    user: user
                })
            }
        } catch(e){
            reject(e)
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
    updateUser,
    ResetPassword,
    enableUser,
    disableUser,
    getListUserChatWithUser,
    getUserById
}


