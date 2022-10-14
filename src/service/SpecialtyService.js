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
            const rows = await db.Specialty.findAll({
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
                raw: true
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

module.exports= {
    addSpecialty,
    getListSpecialty
}