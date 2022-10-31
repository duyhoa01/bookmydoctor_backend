const { Op, where } = require('sequelize');
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
                resolve({
                    errCode: 1,
                    message: response.message
                });
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
                            { name: db.sequelize.where(db.sequelize.fn('concat', db.sequelize.col('firsname'), " ", db.sequelize.col('lastname')), 'LIKE', '%' + key + '%') },
                        ]
                    },
                    attributes: {
                        exclude: ['password','token']
                    },
                },
                // raw: true
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
                // raw: true
            });

            if(!patients){
                resolve ({
                    errCode:2,
                    message:'mã bệnh nhân không tồn tại'
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
                    resData.message='mã bệnh nhân không tồn tại'
            } else{
                let user = await db.User.findOne({
                    where:{
                        id: patient.user_id
                    }
                })
    
                await user.destroy();
                await patient.destroy();

                resData.errCode= 0,
                resData.message='xóa bệnh nhân thành công'
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
            let patient = await db.Patient.findByPk(param.id,
                {   include:
                        {
                            model: db.User,
                            require: true,
                            as: 'user',
                            attributes: {
                                exclude: ['password','token']
                            },
                        }
                });
            if(patient) {
                let user= await db.User.findByPk(patient.user_id)
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
                        id: patient.user_id
                    }
                } )
                await patient.save();
                let patient1 = await db.Patient.findByPk(param.id,
                    {   include:
                            {
                                model: db.User,
                                require: true,
                                as: 'user',
                                attributes: {
                                    exclude: ['password','token']
                                },
                            }
                    });
                resData.errCode = 0;
                resData.errMessage = patient1
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

let getPatientFromIdUser = async (data) => {
    let patient = await db.Patient.findOne({
        include:{
            model: db.User,
            require: true,
            as: 'user',
            attributes: {
                exclude: ['password','token']
            },
            where:{
                id: data.id
            }
        }
    })
    if(patient) {
        return patient
    } else{
        return null
    }
}


module.exports= {
    createPatient:createPatient,
    getAllPatient,
    getPatientById,
    deletePatientById,
    updatePatient,
    getPatientFromIdUser
}