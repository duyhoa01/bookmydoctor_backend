const db = require('../models/index');
const schedule = require('../models/schedule');
const patientService = require('../service/PatientService');
const { Op, where } = require('sequelize');
const appointment = require('../models/appointment');

let createAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resData = {};
            let [status, created] = await db.Status.findOrCreate({
                where: { name: "NEW" }, raw: true
            })

            let patient = await patientService.GetPatientByUserId(data.user_id);
            if(!patient){
                resData.errCode = 1;
                resData.message = 'Không tìm thấy bệnh nhân';
                resolve(resData);
            }
            let schedule = await ScheduleServices.getScheduleById(data.schedule_id);
            if (!schedule) {
                resData.errCode = 2;
                resData.message = 'Không tìm thấy lịch khám';
                resolve(resData);
            }
            let appointment = await db.Appointment.create({
                patient_id: patient.id,
                schedule_id: schedule.id,
                date: schedule.begin,
                sysmptoms: data.sysmptoms,
                status_id: status.id,
            });
            // let appointment = await db.Appointment.create({
            //     patient_id: 32,
            //     schedule_id: 46,
            //     date: "10/12/2021",
            //     symptoms: data.symptoms,
            //     status_id: status.id,
            // });
            if (appointment) {
                resData.errCode = 0;
                resData.message = 'OK';
                resData.data = appointment;
            }
            resolve(resData);
        } catch (e) {
            reject(e);
        }

    });
}
let getAllAppointments = (key, page, limit, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            page = page - 0;
            limit = limit - 0;
            let offset = page * limit;
            let requirement = {};
            if (status !== '') {
                requirement = { name: status };
            }
            const { count, rows } = await db.Appointment.findAndCountAll({
                include: [
                    {
                        model: db.Patient,
                        required: true,
                        as: 'patient',
                        include:
                        {
                            model: db.User,
                            required: true,
                            as: 'user',
                            attributes: {
                                exclude: ['password', 'token']
                            },
                        },
                    },

                    {
                        model: db.Schedule,
                        required: true,
                        as: 'schedule',
                        include:
                        {
                            model: db.Doctor,
                            required: true,
                            as: 'doctor',
                            include:
                            {
                                model: db.User,
                                required: true,
                                as: 'user',
                                attributes: {
                                    exclude: ['password', 'token']
                                },
                            }
                        }
                    },
                    {
                        model: db.Status,
                        required: true,
                        as: 'status',
                        where: requirement
                    }
                ],
                where: {
                    [Op.or]: [
                        { Patientname: db.sequelize.where(db.sequelize.fn('concat', db.sequelize.col('patient.user.firsname'), " ", db.sequelize.col('patient.user.lastname')), 'LIKE', '%' + key + '%') },
                        { Doctorname: db.sequelize.where(db.sequelize.fn('concat', db.sequelize.col('schedule.doctor.user.firsname'), " ", db.sequelize.col('schedule.doctor.user.lastname')), 'LIKE', '%' + key + '%') }
                    ]
                },
                order: [
                    ['date', 'DESC']
                ],
                offset: offset,
                limit: limit,
                raw: true,
                nest: true,
            });
            let resData = {};
            resData.appointment = rows;
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
let getAppointmentById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let appointment = await db.Appointment.findByPk(id, {
                include: [
                    {
                        model: db.Patient,
                        required: true,
                        as: 'patient',
                        include:
                        {
                            model: db.User,
                            required: true,
                            as: 'user',
                            attributes: {
                                exclude: ['password', 'token']
                            },
                        },
                    },

                    {
                        model: db.Schedule,
                        required: true,
                        as: 'schedule',
                        include:
                        {
                            model: db.Doctor,
                            required: true,
                            as: 'doctor',
                            include:
                            {
                                model: db.User,
                                required: true,
                                as: 'user',
                                attributes: {
                                    exclude: ['password', 'token']
                                },
                            }
                        }
                    },
                    {
                        model: db.Status,
                        required: true,
                        as: 'status'
                    }
                ],
                raw: true,
                nest: true,
            });
            resolve(appointment);
        } catch (err) {
            reject(err);
        }
    });
}
let acceptAppointment = (id) => {
    return new Promise(async (resolve, reject) => {
        let resData = {};
        try {
            let appointment = await db.Appointment.findByPk(id, {
                include: [
                    {
                        model: db.Schedule,
                        required: true,
                        as: 'schedule',
                        include:
                        {
                            model: db.Doctor,
                            required: true,
                            as: 'doctor',
                            include:
                            {
                                model: db.User,
                                required: true,
                                as: 'user',
                                attributes: {
                                    exclude: ['password', 'token']
                                },
                            }
                        }
                    },
                    {
                        model: db.Status,
                        required: true,
                        as: 'status'
                    }
                ],
            });
            if (!appointment) {
                resData.errCode = 1;
                resData.message = "Cuộc hẹn không tồn tại";
                resolve(resData);
                return;
            }
            if (appointment.schedule.doctor.user !== req.userID) {
                resData.errCode = 3;
                resData.message = "Không có quyền chấp nhận cuộc hẹn";
                resolve(resData);
                return;
            }
            if (appointment.status.name !== "NEW") {
                resData.errCode = 2;
                resData.message = "Trạng thái cuộc hẹn không phải là NEW";
                resolve(resData);
                return;
            }
            let [statusConfirmed, created2] = await db.Status.findOrCreate({
                where: { name: "CONFIRMED" }, raw: true
            });
            let statusNew = appointment.status_id;
            appointment.status_id = statusConfirmed.id;
            await appointment.save();
            // Khi bác sĩ chấp nhận cuộc hẹn của bệnh nhân
            // Tăng số lượng đã đang ký ở lịch khám và tăng thời gian bắt đầu lịch khám
            await db.Appointment.destroy({
                where: {
                    status: statusNew,
                    schedule_id: appointment.schedule_id 
                }
            })
            resData.errCode = 0;
            resData.message = "OK";
            resolve(resData);
        } catch (err) {
            reject(err);
        }
    });
}
let getAppointmentForUserByUserId = (id, key, page, limit, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            id = id - 0;
            page = page - 0;
            limit = limit - 0;
            let offset = page * limit;
            let requirement = {};
            if (status !== '') {
                requirement = { name: status };
            }
            const { count, rows } = await db.Appointment.findAndCountAll({
                include: [
                    {
                        model: db.Patient,
                        required: true,
                        as: 'patient',
                        include:
                        {
                            model: db.User,
                            required: true,
                            as: 'user',
                            attributes: {
                                exclude: ['password', 'token']
                            },
                        },
                    },

                    {
                        model: db.Schedule,
                        required: true,
                        as: 'schedule',
                        include:
                        {
                            model: db.Doctor,
                            required: true,
                            as: 'doctor',
                            include:
                            {
                                model: db.User,
                                required: true,
                                as: 'user',
                                attributes: {
                                    exclude: ['password', 'token']
                                },
                            }
                        }
                    },
                    {
                        model: db.Status,
                        required: true,
                        as: 'status',
                        where: requirement
                    }
                ],
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { PatientId: db.sequelize.where(db.sequelize.col('patient.user.id'), '=', id) },
                                { DoctorId: db.sequelize.where(db.sequelize.col('schedule.doctor.user.id'), '=', id) }
                            ],
                        },
                        {
                            [Op.or]: [
                                { Patientname: db.sequelize.where(db.sequelize.fn('concat', db.sequelize.col('patient.user.firsname'), " ", db.sequelize.col('patient.user.lastname')), 'LIKE', '%' + key + '%') },
                                { Doctorname: db.sequelize.where(db.sequelize.fn('concat', db.sequelize.col('schedule.doctor.user.firsname'), " ", db.sequelize.col('schedule.doctor.user.lastname')), 'LIKE', '%' + key + '%') },
                            ]
                        }]
                },
                order: [
                    ['date', 'DESC']
                ],
                offset: offset,
                limit: limit,
                raw: true,
                nest: true,
            });
            let resData = {};
            resData.appointment = rows;
            resData.limit = limit;
            resData.totalPages = Math.ceil(count / limit);
            resData.totalElements = count
            resData.page = page;
            resolve(resData);
        } catch (err) {
            reject(err);
        }
    })
}
let ChangeStatusAppointmentToDone = (id) => {
    return new Promise(async(resolve,reject) => {
        try {
            let resData = {};
            let appointment = await db.Appointment.findByPk(id,{
                include:
                {
                    model: db.Status,
                    required: true,
                    as: 'status'
                }
            });
            if (!appointment) {
                resData.errCode = 1;
                resData.message = 'Cuộc hẹn không tồn tại';
                resolve(resData);
                return;
            }
            if (appointment.status.name !== "CONFIRMED") {
                resData.errCode = 2;
                resData.message = 'Không thể xác thực hoàn thành cuộc hẹn khi trạng thái cuộc hẹn khác CONFIRMED';
                resolve(resData);
                return;
            }
            if(appointment.date < Date.now()) {
                resData.errCode = 3;
                resData.message = 'Thời gian cuộc hẹn chưa kết thúc';
                resolve(resData);
                return;
            }
            let [status, created] = await db.Status.findOrCreate({
                where: { name: "DONE" }, raw: true
            });
            appointment.status_id = status.id;
            await appointment.save();
            resData.errCode = 0;
            resData.message = 'OK';
            resolve(resData);
        } catch (e) {
            reject(e);
        }
    });
}
let CanCelAppointment = (id) => {
    return new Promise(async (resolve, reject) => {
        let resData = {};
        try {
            let appointment = await db.Appointment.findByPk(id, {
                include: [
                    {
                        model: db.Patient,
                        required: true,
                        as: 'patient',
                        include:
                        {
                            model: db.User,
                            required: true,
                            as: 'user',
                            attributes: {
                                exclude: ['password', 'token']
                            },
                        },
                    },
                    {
                        model: db.Status,
                        required: true,
                        as: 'status'
                    }
                ],
            });
            if (!appointment) {
                resData.errCode = 1;
                resData.message = "Cuộc hẹn không tồn tại";
                resolve(resData);
                return;
            }
            if (appointment.patient.user !== req.userID) {
                resData.errCode = 3;
                resData.message = "Không có quyền hủy cuộc hẹn";
                resolve(resData);
                return;
            }
            if (appointment.status.name !== "NEW") {
                resData.errCode = 2;
                resData.message = "Chỉ có thể hủy cuộc hẹn khi trạng thái cuộc hẹn là NEW";
                resolve(resData);
                return;
            }
            let [statusCancel, created] = await db.Status.findOrCreate({
                where: { name: "CANCEL" }, raw: true
            });
            appointment.status_id = statusCancel.id;
            await appointment.save();
            resData.errCode = 0;
            resData.message = "OK";
            resolve(resData);
        } catch (err) {
            reject(err);
        }
    });
}
let deleteAppointment = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            let resData = {};
            let appointment = await db.Appointment.findByPk(id);
            if (!appointment) {
                resData.errCode = 1;
                resData.message = 'Cuộc hẹn không tồn tại';
                resolve(resData);
                return;
            }
            await appointment.destroy();
            resData.errCode = 0;
            resData.message = 'OK';
            resolve(resData);
        } catch (err) {
            reject(err);
        }
    })
}
module.exports = {
    createAppointment: createAppointment,
    getAllAppointments: getAllAppointments,
    getAppointmentById: getAppointmentById,
    acceptAppointment: acceptAppointment,
    getAppointmentForUserByUserId: getAppointmentForUserByUserId,
    ChangeStatusAppointmentToDone: ChangeStatusAppointmentToDone,
    CanCelAppointment: CanCelAppointment,
    deleteAppointment: deleteAppointment
}