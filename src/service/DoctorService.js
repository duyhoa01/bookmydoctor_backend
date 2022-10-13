const db = require('../models/index');
const userService = require('./UserService');

let getAllDoctor = (page, limit) => {
    return new Promise(async(resolve, reject) => {
        try {
            page = page ? page-0 : 0;
            limit = limit ? limit-0 : 5;
            let offset = page*limit-0;
            let allDoctor = await db.Doctor.findAll({
                include: {
                    model: db.User,
                    required: true,
                    as : 'user',
                    attributes: {
                        exclude: ['password']
                    },
                    where: {
                        status: 1
                    },
                },
                offset: offset,
                limit: limit,

                raw: true                    
            });
            resolve(allDoctor);
        } catch (err) {
            reject(err);
        }
    });
}

let getDoctorById = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            console.log(typeof(id));
            let allDoctor = await db.Doctor.findAll({
                include: {
                    model: db.User,
                    required: true,
                    as : 'user',
                    attributes: {
                        exclude: ['password']
                    },
                },
                where: {
                    id: id,
                },
                raw: true                   
            });
            resolve(allDoctor);
        } catch (err) {
            reject(err);
        }
    });
}
let createDoctor = (data) => {
    return new Promise(async(resolve, reject) => {
        let doctorData = {};
        try{
            let userData = await userService.createUser(data,"ROLE_DOCTOR");
            if (userData.errCode === 0) {
                const doctor = await db.Doctor.create(
                    {
                        name: data.lastname + " " + data.firsname,
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
                doctorData.user = userData.user;
                doctorData.doctor = doctor;
            } else {
                doctorData.errCode = userData.errCode;
                doctorData.errMessage = userData.errMessage;
            }
            resolve(doctorData);
        } catch(err){
            reject(err);
        }
    });
}
let updateDoctor = (data) => {
    return new Promise(async(resolve, reject) => {
        try{
            let doctorData ={};
            let doctor = await db.Doctor.findByPk(data.id);
            if(doctor) {
                let user = await db.User.findByPk(doctor.user_id);
                // Sua thon tin user lien ket voi doctor
                user.age = data.age;
                user.email = data.email;
                user.image = data.image;
                user.gender = data.gender;
                user.phoneNumber = data.phoneNumber;
                user.save();
                // Sua thong tin doctor
                doctor.name = data.name;
                doctor.description = data.description;
                doctor.hospital_id = data.hospital_id;
                doctor.clinic_id = data.clinic_id;
                doctor.specialty_id = data.specialty_id;
                await doctor.save();
                doctorData.errCode = 0;
                doctorData.errMessage = "OK"
            }
            else {
                doctorData.errCode = 2;
                doctorData.errMessage = "khong ton tai doctor co id nay"
            }
            resolve(doctorData);
        } catch(e){
            reject(e);
        }
    });
}
let deleteDoctor = (id) => {
    return new Promise(async(resolve, reject) => {
        try{
            let doctorData ={};
            let doctor = await db.Doctor.findByPk(id);
            if(doctor) {
                let user = await db.User.findByPk(doctor.user_id);
                user.status = 0; // Chuyen trang thai tai khoan user bi khoa
                await user.save();
                await doctor.destroy(); // xoa doctor
                doctorData.errCode = 0;
                doctorData.errMessage = "OK"
            }
            else {
                doctorData.errCode = 2;
                doctorData.errMessage = "Không tồn tại doctor có id = " + id;
            }
            resolve(doctorData);
        } catch(e){
            reject(e);
        }
    });
}
// let getDoctorBySpecialty = (id) => {
//     return new Promise((resolve, reject) => {
//         try {
//             db.
//         } catch (e) {
//             reject(e);
//         }
//     });
// }
module.exports = {
    getAllDoctor: getAllDoctor,
    getDoctorById: getDoctorById,
    createDoctor: createDoctor,
    updateDoctor: updateDoctor,
    deleteDoctor: deleteDoctor,
    // getDoctorBySpecialty: getDoctorBySpecialty,
}
