const db= require('../models');
const { Op, where } = require('sequelize');

let addSpecialty = async (data) =>{
    return new Promise( async (resolve, reject)=>{
        try {
            const specialty= await db.Specialty.create(
                {
                    name: data.name,
                    description: data.description,
                    image: data.image
                }
            );

            resolve({
                errCode:0,
                message:specialty
            })
        } catch (e) {
            reject(e)
        }
    });
}

let getListSpecialty = async (key) =>{
    return new Promise(async(resolve, reject) => {
        try {
            let rows = await db.Specialty.findAll({
                order: [
                    ['sum_doctor', 'DESC']
                ],
                include: {
                    model: db.Doctor,
                    require: true,
                    as: 'doctors',
                    attributes: [
                       'id'
                    ],
                },
                where:{
                    name: db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('name')), 'LIKE', '%' + key + '%')
                },
                attributes: {
                    include: [[db.sequelize.fn('COUNT', db.sequelize.col('doctors.id')), 'sum_doctor']]
                },
                group: ['Specialty.id'],
                raw:true
            });

            resolve({
                errCode:0,
                message: rows
            })

        } catch (err) {
            reject(err)
        }
    })
}

let deleteSpecialty = (data) =>{
    return new Promise(async(resolve, reject) => {
        try {

            resData= {}
            let specialty= await db.Specialty.findOne({
                where:{
                    id: data.id
                }
            });

            if( !specialty){
                    resData.errCode= 2,
                    resData.message='mã chuyên khoa không tồn tại'
            } else{
                await specialty.destroy();

                resData.errCode= 0,
                resData.message='xóa chuyên khoa thành công'
            }
            
           resolve(resData)

        } catch (err) {
            reject(err)
        }
    })
}

let updateSpecialty = (param,data) => {
    return new Promise(async(resolve, reject) => {
        let resData = {};
        try{
            let specialty = await db.Specialty.findByPk(param.id);
            if(specialty) {
                await db.Specialty.update({
                    name: data.name,
                    description: data.description,
                    image: data.image !== '0' ? data.image : specialty.image,
                },
                {
                    where:{
                        id: specialty.id
                    }
                } )
                let spe = await db.Specialty.findByPk(param.id);
                resData.errCode = 0;
                resData.errMessage = spe
            }
            else {
                resData.errCode = 2;
                resData.errMessage = "mã chuyên khoa không tồn tại"
            }
            resolve(resData)
        } catch(e){
            reject(e);
        }
    });
}

let getSpecialtyById = async (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let specialty = await db.Specialty.findOne({
                include: {
                    model: db.Doctor,
                    require: true,
                    as: 'doctors'
                },
                where:{
                    id: data.id
                }
            });

            if(specialty){
                resolve({
                    errCode:0,
                    message: specialty
                })
            } else {
                resolve({
                    errCode:2,
                    message: "id chuyên khoa không tồn tại"
                })
            }

        } catch (err) {
            reject(err)
        }
    })
}

module.exports= {
    addSpecialty,
    getListSpecialty,
    deleteSpecialty,
    updateSpecialty,
    getSpecialtyById
}