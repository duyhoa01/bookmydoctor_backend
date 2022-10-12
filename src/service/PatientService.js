const { Op } = require('sequelize');
const db= require('../models');
const userService = require('./UserService')

let createPatient = async (data)=>{
    return new Promise( async (resolve, reject)=>{
        try{
            let response= await userService.createNewUser(data,'ROLE_PATIENT');
            console.log(response)
            if(response.errCode===0){
                const patient= await db.Patient.create(
                    {
                        user_id: response.message.id
                    }
                )
                resolve({
                    errCode: 0,
                    message: patient
                });
            } else {
                resolve(response);
            }
            
        } catch(e){
            reject(e);
        }
    })
}


let getAllPatient = async (key, pageNumber, size) =>{
    pageNumber = pageNumber-0;
    size = size -0;
    return new Promise(async(resolve, reject) => {
        let resData = {};
        try {
            const {count, rows} = await db.Patient.findAndCountAll({
                offset: pageNumber*size,
                limit: size,
                order: [
                    ['id', 'DESC']
                ],
                include: {
                    model: db.User,
                    require: true,
                    as: 'user',
                    where:{
                        [Op.or]:[
                         {firsname: db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('firsname')), 'LIKE', '%' + key + '%')},
                         {lastname: db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('lastname')), 'LIKE', '%' + key + '%')}
                        ]
                    },
                    attributes: {
                        exclude: ['password','token']
                    },
                },
                raw: true
            });

            resData.patients= rows;
            resData.size=size;
            resData.totalPages= Math.ceil(count/size);
            resData.totalElements=count
            resData.page = pageNumber
            resolve(resData)

        } catch (err) {
            reject(err)
        }
    })
}

let getPatientById = async (data) =>{
    return new Promise(async(resolve, reject) => {
        try {

            let patients= await db.Patient.findOne({
                where:{
                    id: data.id
                },
                include: {
                    model: db.User,
                    require: true,
                    as: 'user',
                    attributes: {
                        exclude: ['password','token']
                    },
                },
                raw: true
            });

            if(!patients){
                resolve ({
                    errCode:2,
                    message:'khong ton tai patient'
                })
            }

            resolve({
                errCode:0,
                message:patients
            })

        } catch (err) {
            reject(err)
        }
    })
}

let deletePatientById = async (data) =>{
    return new Promise(async(resolve, reject) => {
        try {

            resData= {}
            let patient= await db.Patient.findOne({
                where:{
                    id: data.id
                }
            });

            if( !patient){
                    resData.errCode= 2,
                    resData.message='patient khong ton tai'
            } else{
                let user = await db.User.findOne({
                    where:{
                        id: patient.user_id
                    }
                })
    
                await user.destroy();
                await patient.destroy();

                resData.errCode= 0,
                resData.message='xoa patient thanh cong'
            }
            
           resolve(resData)

        } catch (err) {
            reject(err)
        }
    })
}

let updatePatient = (param,data) =>{
    return new Promise(async(resolve, reject) => {
        let resData = {};
        try{
            let patient = await db.Patient.findByPk(param.id);
            if(patient) {
                let user = await db.User.findByPk(patient.user_id);
                // Sua thon tin user lien ket voi 
                user.age = data.age;
                user.firsname = data.firsname;
                user.lastname = data.lastname
                if(data.image !=='0'){
                    user.image =  data.image;
                }
                user.gender = data.gender;
                user.phoneNumber = data.phoneNumber;
                await user.save();
                await patient.save();
                resData.errCode = 0;
                resData.errMessage = "OK"
            }
            else {
                resData.errCode = 2;
                resData.errMessage = "khong ton tai doctor co id nay"
            }
            resolve(resData)
        } catch(e){
            reject(e);
        }
    });
}

module.exports= {
    createPatient:createPatient,
    getAllPatient,
    getPatientById,
    deletePatientById,
    updatePatient
}