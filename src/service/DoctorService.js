const db = require('../models/index');
const userService = require('./UserService');
const { Op, where } = require('sequelize');
const specialtyService = require('./SpecialtyService');
const hospitalService = require('./HospitalService');
const clinicService = require('./ClinicService');


let getAllDoctor = (key, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            page = page - 0;
            limit = limit - 0;
            let offset = page * limit;
            const { count, rows } = await db.Doctor.findAndCountAll({
                include: [
                    {
                        model: db.User,
                        required: true,
                        as: 'user',
                        attributes: {
                            exclude: ['password', 'token']
                        },
                        where: {
                            status: 1,
                            [Op.or]: [
                                { name: db.sequelize.where(db.sequelize.fn('concat', db.sequelize.col('firsname'), " ", db.sequelize.col('lastname')), 'LIKE', '%' + key + '%') },
                            ]
                        },
                    },
                    {
                        model: db.Hospital,
                        required: true,
                        as: 'hospital',
                    },
                    {
                        model: db.Clinic,
                        required: true,
                        as: 'clinic', 
                    },
                    {
                        model: db.Specialty,
                        required: true,
                        as: 'specialty', 
                    }

                ],

                offset: offset,
                limit: limit,

                raw: true,
                nest: true,
            });
            let resData = {};
            resData.doctor = rows;
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

let getDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.Doctor.findOne({
                include: [
                    {
                        model: db.User,
                        required: true,
                        as: 'user',
                        attributes: {
                            exclude: ['password', 'token']
                        }
                    },
                    {
                        model: db.Hospital,
                        required: true,
                        as: 'hospital',
                    },
                    {
                        model: db.Clinic,
                        required: true,
                        as: 'clinic', 
                    },
                    {
                        model: db.Specialty,
                        required: true,
                        as: 'specialty', 
                    }

                ],
                where: {
                    id: id,
                },
                raw: true,
                nest: true,
            });
            resolve(doctor);
        } catch (err) {
            reject(err);
        }
    });
}
let createDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        let doctorData = {};
        try {
            let data1 = {};
            data1.id = data.specialty_id;

            let specialtyData = await specialtyService.getSpecialtyById(data1);

            if(specialtyData.errCode !== 0) {
                doctorData.errCode = 404;
                doctorData.errMessage = "Không tồn tại chuyên khoa có id này";
                resolve(doctorData);
            }
            let hospital = await hospitalService.getHospitalById(data.hospital_id);
            if(!hospital) {
                doctorData.errCode = 404;
                doctorData.errMessage = "Không tồn tại bệnh viện có id này";
                resolve(doctorData);
            }
            let clinic = await clinicService.getClinicById(data.clinic_id);
            if(!clinic) {
                doctorData.errCode = 404;
                doctorData.errMessage = "Không tồn tại phòng khám có id này";
                resolve(doctorData);
            }
            let userData = await userService.AdminCreateUser(data, "ROLE_DOCTOR");
            if (userData.errCode === 0) {
                const doctor = await db.Doctor.create(
                    {
                        description: data.description,
                        rate: data.rate,
                        user_id: userData.user.id,
                        hospital_id: data.hospital_id,
                        clinic_id: data.clinic_id,
                        specialty_id: data.specialty_id
                    }
                )
                doctorData.errCode = 0;
                doctorData.errMessage = "OK";
                // doctorData.user = userData.user;
                let doctor1 = await db.Doctor.findOne({
                    include: {
                        model: db.User,
                        required: true,
                        as: 'user',
                        attributes: {
                            exclude: ['password', 'token']
                        },
                    },
                    where: {
                        id: doctor.id,
                    },
                    raw: true,
                    nest: true
                });
                doctorData.doctor = doctor1;
            } else {
                doctorData.errCode = userData.errCode;
                doctorData.errMessage = userData.errMessage;
            }
            resolve(doctorData);
        } catch (err) {
            reject(err);
        }
    });
}
let updateDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctorData = {};
            let data1 = {};
            data1.id = data.specialty_id;

            let specialtyData = await specialtyService.getSpecialtyById(data1);

            if(specialtyData.errCode !== 0) {
                doctorData.errCode = 404;
                doctorData.errMessage = "Không tồn tại chuyên khoa có id này";
                resolve(doctorData);
            }
            let hospital = await hospitalService.getHospitalById(data.hospital_id);
            if(!hospital) {
                doctorData.errCode = 404;
                doctorData.errMessage = "Không tồn tại bệnh viện có id này";
                resolve(doctorData);
            }
            let clinic = await clinicService.getClinicById(data.clinic_id);
            if(!clinic) {
                doctorData.errCode = 404;
                doctorData.errMessage = "Không tồn tại phòng khám có id này";
                resolve(doctorData);
            }
            let doctor = await db.Doctor.findByPk(data.id);
            if (doctor) {
                let param = {};
                param.id = doctor.user_id;
                // Sua thon tin user lien ket voi doctor
                await userService.updateUser(param,data);
                // Sua thong tin doctor
                doctor.description = data.description;
                doctor.hospital_id = data.hospital_id;
                doctor.clinic_id = data.clinic_id;
                doctor.specialty_id = data.specialty_id;
                doctor.rate = data.rate;
                await doctor.save();
                let doctorEdit = await db.Doctor.findByPk(data.id,
                    {
                        include:
                        {
                            model: db.User,
                            require: true,
                            as: 'user',
                            attributes: {
                                exclude: ['password', 'token']
                            },
                        }
                    });
                doctorData.errCode = 0;
                doctorData.errMessage = doctorEdit;
            }
            else {
                doctorData.errCode = 2;
                doctorData.errMessage = "Không tồn tại doctor có id này";
            }
            resolve(doctorData);
        } catch (e) {
            reject(e);
        }
    });
}
let deleteDoctor = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctorData = {};
            let doctor = await db.Doctor.findByPk(id);
            if (doctor) {
                let user = await db.User.findByPk(doctor.user_id);
                user.status = 0; // Chuyen trang thai tai khoan user bi khoa
                await user.save();
                await doctor.destroy(); // xoa doctor
                doctorData.errCode = 0;
                doctorData.errMessage = "OK"
            }
            else {
                doctorData.errCode = 2;
                doctorData.errMessage = "Không tồn tại doctor có id này";
            }
            resolve(doctorData);
        } catch (e) {
            reject(e);
        }
    });
}
let getDoctorBySpecialty = (id, key, page, limit) => {
    return new Promise(async(resolve, reject) => {
        try {
            page = page - 0;
            limit = limit - 0;
            let offset = page * limit;
            const { count, rows } = await db.Doctor.findAndCountAll({
                include: {
                    model: db.User,
                    required: true,
                    as: 'user',
                    attributes: {
                        exclude: ['password', 'token']
                    },
                    where: {
                        status: 1,
                        [Op.or]: [
                            { name: db.sequelize.where(db.sequelize.fn('concat', db.sequelize.col('firsname'), " ", db.sequelize.col('lastname')), 'LIKE', '%' + key + '%') },
                        ]
                    },
                },
                offset: offset,
                limit: limit,
                where: { specialty_id: id },
                raw: true,
                nest: true
            });
            let resData = {};
            resData.doctor = rows;
            resData.limit=limit;
            resData.totalPages= Math.ceil(count/limit);
            resData.totalElements=count
            resData.page = page;
            resolve(resData);
        } catch (e) {
            reject(e);
        }
    });
}
let getDoctorByHospital = (id, key, page, limit) => {
    return new Promise(async(resolve, reject) => {
        try {
            page = page - 0;
            limit = limit - 0;
            let offset = page * limit;
            const { count, rows } = await db.Doctor.findAndCountAll({
                include: {
                    model: db.User,
                    required: true,
                    as: 'user',
                    attributes: {
                        exclude: ['password', 'token']
                    },
                    where: {
                        status: 1,
                        [Op.or]: [
                            { name: db.sequelize.where(db.sequelize.fn('concat', db.sequelize.col('firsname'), " ", db.sequelize.col('lastname')), 'LIKE', '%' + key + '%') },
                        ]
                    },
                },
                offset: offset,
                limit: limit,
                where: { hospital_id: id },
                raw: true,
                nest: true
            });
            let resData = {};
            resData.doctor = rows;
            resData.limit=limit;
            resData.totalPages= Math.ceil(count/limit);
            resData.totalElements=count
            resData.page = page;
            resolve(resData);
        } catch (e) {
            reject(e);
        }
    });
}
module.exports = {
    getAllDoctor: getAllDoctor,
    getDoctorById: getDoctorById,
    createDoctor: createDoctor,
    updateDoctor: updateDoctor,
    deleteDoctor: deleteDoctor,
    getDoctorBySpecialty: getDoctorBySpecialty,
    getDoctorByHospital: getDoctorByHospital,
}
