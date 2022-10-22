const db = require('../models/index');
const { Op, where } = require('sequelize');


let createClinic = (data) => {
    return new Promise(async(resolve, reject) => {
        let resData = {};
        try{
            let clinic = await db.Clinic.create(
                {
                    name: data.name,
                    street: data.street,
                    city: data.city,
                    image: data.image,
                }
            )
            resData.errCode = 0;
            resData.errMessage = clinic;
            resolve(resData);
        } catch(err) {
            reject(err);
        }
    })
}
let getAllClinic = (key, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            page = page - 0;
            limit = limit - 0;
            let offset = page * limit;
            const { count, rows } = await db.Clinic.findAndCountAll({
                where: {
                    [Op.or]: [
                        { name: db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('name')), 'LIKE', '%' + key + '%') },
                    ]
                },
                offset: offset,
                limit: limit,
                raw: true,
                nest: true
            });
            let resData = {};
            resData.clinic = rows;
            resData.limit = limit;
            resData.totalPages = Math.ceil(count / limit);
            resData.totalElements = count
            resData.page = page;
            resolve(resData);
        } catch (err) {
            reject(err);
        }
    });
}

let getClinicById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinic = await db.Clinic.findByPk(id, {
                include: {
                    model: db.Doctor,
                    require: true,
                    as: 'doctors',
                    include: {
                        model: db.User,
                        required: true,
                        as: 'user',
                        attributes: {
                            exclude: ['password', 'token']
                        },
                        where: {
                            status: 1,
                        },
                    },
                },
            });   
            resolve(clinic);
        } catch (err) {
            reject(err);
        }
    });
}
let searchClinic = (key) => {
    return new Promise(async(resolve, reject) => {
        try {
            let clinic = await db.Clinic.findAll({
                where: {
                    [Op.or]: [
                        { name: db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('name')), 'LIKE', key + '%') },
                    ]
                },
            });
            resolve(clinic);
        } catch (err) {
            reject(err);
        }
    })
}
let updateClinic = (id, data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let resData = {};
            let clinic = await db.Clinic.findByPk(id);
            if (clinic) {
                clinic.name = data.name;
                clinic.street = data.street;
                clinic.city = data.city;
                clinic.image = data.image !== '0' ? data.image : clinic.image; 
                await clinic.save();
                resData.errCode = 0;
                resData.errMessage = clinic;
            } else {
                resData.errCode = 1;
                resData.errMessage = "Không tồn tại phòng khám có id này";
            }
            resolve(resData);
        } catch (err) {
            reject(err);
        }
    })
}
let deleteClinic = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            let resData = {};
            let clinic = await getClinicById(id);
            if (!clinic) {
                resData.errCode = 1;
                resData.errMessage = "Không tồn tại phòng khám có id này";
            } else {
                clinic.destroy();
                resData.errCode = 0;
                resData.errMessage = "OK";
            }
            resolve(resData);
        } catch (err) {
            reject(err);
        }
    })
}
module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getClinicById: getClinicById,
    searchClinic: searchClinic,
    updateClinic: updateClinic,
    deleteClinic: deleteClinic,
}