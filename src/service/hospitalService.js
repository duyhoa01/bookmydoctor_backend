const db = require('../models/index');
const { Op, where } = require('sequelize');
const doctorService = require('./DoctorService');



let createHospital = (data) => {
    console.log('service');
    return new Promise(async(resolve, reject) => {
        let resData = {};
        try{
            let hospital = await db.Hospital.create(
                {
                    name: data.name,
                    street: data.street,
                    city: data.city,
                    image: data.image,
                }
            )
            resData.errCode = 0;
            resData.errMessage = hospital;
            resolve(resData);
        } catch(err) {
            reject(err);
        }
    })
}
let getAllHospital = (key, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            page = page - 0;
            limit = limit - 0;
            let offset = page * limit;
            const { count, rows } = await db.Hospital.findAndCountAll({
                where: {
                    [Op.or]: [
                        { name: db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('name')), 'LIKE', '%' + key + '%') },
                    ]
                },
                offset: offset,
                limit: limit,

                raw: true
            });
            let resData = {};
            resData.hospital = rows;
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

let getHospitalById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hospital = await db.Hospital.findByPk(id, 
                {
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
                });
            resolve(hospital);
        } catch (err) {
            reject(err);
        }
    });
}
let searchHospital = (key) => {
    return new Promise(async(resolve, reject) => {
        try {
            let hospital = await db.Hospital.findAll({
                where: {
                    [Op.or]: [
                        { name: db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('name')), 'LIKE', key + '%') },
                    ]
                },
            });
            resolve(hospital);
        } catch (err) {
            reject(err);
        }
    })
}
let updateHospital = (id, data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let resData = {};
            let hospital = await db.Hospital.findByPk(id);
            if (hospital) {
                hospital.name = data.name;
                hospital.street = data.street;
                hospital.city = data.city;
                hospital.image = data.image !== '0' ? data.image : hospital.image; 
                await hospital.save();
                resData.errCode = 0;
                resData.errMessage = hospital;
            } else {
                resData.errCode = 1;
                resData.errMessage = "Không tồn tại bệnh viện có id này";
            }
            resolve(resData);
        } catch (err) {
            reject(err);
        }
    })
}
let deleteHospital = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            let resData = {};
            let hospital = await getHospitalById(id);
            if (!hospital) {
                resData.errCode = 1;
                resData.errMessage = "Không tồn tại bệnh viện có id này";
            } else {
                hospital.destroy();
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
    createHospital: createHospital,
    getAllHospital: getAllHospital,
    getHospitalById: getHospitalById,
    searchHospital: searchHospital,
    updateHospital: updateHospital,
    deleteHospital: deleteHospital,
}