const db = require('../models/index');
const userService = require('./UserService');
const { Op, where } = require('sequelize');
const specialtyService = require('./SpecialtyService');
const hospitalService = require('./hospitalService');
const clinicService = require('./clinicService');
const { QueryTypes } = require('sequelize');

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
                order: [
                    ['rate', 'DESC'],
                    ['numberOfReviews', 'DESC']
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
                        },
                        where: {status: 1}
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
                    // {
                    //     model: db.Schedule,
                    //     require: true,
                    //     as: 'schedules', 
                    // }

                ],
                where: {
                    id: id,
                },
                // raw: true,
                // nest: true,
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
                        rate: 0,
                        numberOfReviews: 0,
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
let RatingDoctor = (id, scores, scoresOld) => {
    return new Promise(async(resolve, reject) => {
        try {
            let doctor = await db.Doctor.findByPk(id);
            if (!scoresOld) {
                // if (doctor.numberOfReviews === null) doctor.numberOfReviews = 0;
                doctor.rate = (doctor.rate*doctor.numberOfReviews + scores)/(doctor.numberOfReviews + 1);
                doctor.numberOfReviews++;
            } else {
                doctor.rate = (doctor.rate*doctor.numberOfReviews - scoresOld + scores)/(doctor.numberOfReviews);
            }
            await doctor.save();
            resolve(true);
        } catch (e) {
            reject(e);
        }
    })
}
let getRevenueOfAllDoctors = async (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            pageNumber = data.pageNumber-0;
            size = data.size -0;
            await db.sequelize.query("SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'");
            let sql= "select * from (Select d.id, d.description,d.rate,d.user_id,d.hospital_id,d.clinic_id,d.specialty_id,"
            +"u.email as 'user.email',u.firsname as 'user.firsname',u.lastname as 'user.lastname',u.image as 'user.image',u.gender as 'user.gender',u.phoneNumber as 'user.phoneNumber',u.birthday as 'user.birthday',u.address as 'user.address',u.status as 'user.status',u.role_id as 'user.role_id'  from Doctors d INNER JOIN Users u ON d.user_id = u.id) p1 "
            +" LEFT JOIN (select s.doctor_id,sum(s.cost) as revenue , count(s.id) as done from Schedules s  LEFT JOIN Appointments a ON s.id = a.schedule_id LEFT JOIN Statuses sta ON a.status_id = sta.id where sta.name = 'DONE' and s.status = true and s.begin between :beginDate and :endDate  GROUP BY s.doctor_id ) p2 ON p1.id = p2.doctor_id ORDER BY revenue DESC LIMIT :limit OFFSET :offset;;"
            let doctors = await db.sequelize.query(sql,{ replacements: { beginDate: data.begin, endDate: data.end , limit : size , offset: pageNumber*size },type: QueryTypes.SELECT })
            let length = await db.Doctor.count();
            let arr = Array.from(doctors)
            arr.forEach(d => {
                d.revenue= d.revenue === null ? 0: d.revenue;
                d.done= d.done === null ? 0: d.done;
                d.profits = d.revenue * 0.9;
                return d;
            })
            let resData = {};
            resData.doctors= doctors;
            resData.size=size;
            resData.totalPages= Math.ceil(length/size);
            resData.totalElements=length
            resData.page = pageNumber
            resolve(resData)
        } catch (e) {
            reject(e)
        }
    });
}
let getRevenueOfDoctor = async (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            await db.sequelize.query("SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'");
            let sql= "select * from (Select d.id, d.description,d.rate,d.user_id,d.hospital_id,d.clinic_id,d.specialty_id,"
            +"u.email as 'user.email',u.firsname as 'user.firsname',u.lastname as 'user.lastname',u.image as 'user.image',u.gender as 'user.gender',u.phoneNumber as 'user.phoneNumber',u.birthday as 'user.birthday',u.address as 'user.address',u.status as 'user.status',u.role_id as 'user.role_id'  from Doctors d INNER JOIN Users u ON d.user_id = u.id WHERE d.id= :doctor_id) p1 "
            +" LEFT JOIN (select s.doctor_id,sum(s.cost) as revenue , count(s.id) as done from Schedules s  LEFT JOIN Appointments a ON s.id = a.schedule_id LEFT JOIN Statuses sta ON a.status_id = sta.id where sta.name = 'DONE' and s.status = true and s.begin between :beginDate and :endDate  GROUP BY s.doctor_id ) p2 ON p1.id = p2.doctor_id ORDER BY revenue DESC LIMIT 1;"
            let doctors = await db.sequelize.query(sql,{ replacements: { beginDate: data.begin, endDate: data.end, doctor_id: data.doctor_id },type: QueryTypes.SELECT })
            let arr = Array.from(doctors)
            if(arr.length == 0){
                return resolve({
                    errCode: 1,
                    message: 'id bác sĩ không tồn tại'
                })
            }
            let doctor = doctors[0] 
            doctor.revenue= doctor.revenue === null ? 0: doctor.revenue;
            doctor.done= doctor.done === null ? 0: doctor.done;
            doctor.profits = doctor.revenue * 0.9;
            console.log(doctor)
            return resolve({
                errCode: 0,
                doctor: doctor
            })
        } catch (e) {
            reject(e)
        }
    });
}
let updatePaidDoctor = async(doctor_id, date) => {
    try {
        await db.Doctor.update(
            {
                paid: date
            },
            {
                where: {id:doctor_id}
            }
        )
    } catch (e) {
        console.log(e);
    }
}
let checkPaid = async(user_id) => {
    try {
        let doctor = await db.Doctor.findOne({
            include: {
                model: db.User,
                required: true,
                as: 'user',
                where: {id: user_id}
            },
        })
        if (!doctor.paid) return false;
        const d = new Date();
        let month = d.getMonth() + 1;
        let year = d.getFullYear();
        monthly = new Date(year + "-" + month + "-01");
        let monthlyPayment = doctor.paid;
        // kiem tra co can phai tra phi dung hang thang khong
        if (monthlyPayment.getMonth() === d.getMonth() && monthlyPayment.getFullYear() === d.getFullYear()) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log(e);
    }
}
module.exports = {
    getAllDoctor: getAllDoctor,
    getDoctorById: getDoctorById,
    createDoctor: createDoctor,
    updateDoctor: updateDoctor,
    deleteDoctor: deleteDoctor,
    getDoctorBySpecialty: getDoctorBySpecialty,
    getDoctorByHospital: getDoctorByHospital,
    RatingDoctor,
    getRevenueOfAllDoctors: getRevenueOfAllDoctors,
    getRevenueOfDoctor: getRevenueOfDoctor,
    updatePaidDoctor,
    checkPaid
}


