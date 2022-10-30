const db= require('../models');
const { Op, where } = require('sequelize');
const { QueryTypes } = require('sequelize');
const { raw } = require('express');

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
            let roww=await db.sequelize.query("SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'");
            let spes = await db.sequelize.query("SELECT DISTINCT s.id,s.name,s.image,s.createdAt,s.updatedAt,s.description,COUNT(d.id) as sum_doctor FROM Specialties as s LEFT JOIN Doctors as d ON s.id=d.specialty_id WHERE s.name LIKE CONCAT('%',:key,'%') GROUP BY s.id;",{ replacements: { key: key },type: QueryTypes.SELECT })

            resolve({
                errCode:0,
                message: spes
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
                    as: 'doctors',
                    include: [
                        {
                            model: db.User,
                            required: true,
                            as: 'user',
                            attributes: {
                                exclude: ['password', 'token']
                            },
                            where: {status: 1}
                        },
                        {
                            model: db.Hospital,
                            required: true,
                            as: 'hospital',
                        },
                        {
                            model: db.Specialty,
                            required: true,
                            as: 'specialty',
                        },
                        {
                            model: db.Clinic,
                            required: true,
                            as: 'clinic', 
                        },
                    ]

                },
                where:{
                    id: data.id
                },
            });
            console.log(specialty);

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