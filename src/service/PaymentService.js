const { QueryTypes } = require('sequelize');
const db = require('../models/index');
const { Op, where } = require('sequelize');

let doctorPayment = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            id = id - 0;
            let resData = {};
            let monthlyFee = 0;
            let appointmentFee = 0;
            let monthly = null;

            const doctor = await db.Doctor.findByPk(id, {
                attributes: ['paid'],
            })
            if (!doctor) {
                resData.errCode = 1;
                resData.message = 'Không tìm thấy bác sĩ có id này';
                resolve(resData);
                return;
            }

            const d = new Date();
            let month = d.getMonth() + 1;
            let year = d.getFullYear();
            monthly = new Date(year + "-" + month + "-01");
            if (!doctor.paid) {
                monthlyFee = process.env.monthlyFee;
            } else {
                let monthlyPayment = doctor.paid;
                // kiem tra co can phai tra phi dung hang thang khong
                if (monthlyPayment.getMonth() === d.getMonth() && monthlyPayment.getFullYear() === d.getFullYear()) {
                    monthlyFee = 0;
                } else {
                    monthlyFee = process.env.monthlyFee;
                }
            }
            monthlyFee = monthlyFee - 0;
            let sql = "SELECT SUM(cost) as AppointmentFee FROM ((SELECT id, cost FROM Schedules WHERE doctor_id = :id) as s"
                + " INNER JOIN (SELECT schedule_id, status_id FROM (SELECT schedule_id, status_id FROM Appointments WHERE paymentId is null) as a INNER JOIN Statuses as sta ON a.status_id = sta.id WHERE sta.name = 'DONE') as a1 ON a1.schedule_id = s.id)"
            let appointments = await db.sequelize.query(sql, { replacements: { id: id }, type: QueryTypes.SELECT })
            appointmentFee = appointments[0].AppointmentFee * 0.1;
            let totalPayment = monthlyFee + appointmentFee;
            resData.errCode = 0;
            resData.message = {
                datePayment: new Date(),
                doctor_id: id,
                monthlyFee: monthlyFee,
                appointmentFee: appointmentFee,
                totalPayment: totalPayment,
                monthly: monthly,
            };
            console.log(resData.message);
            resolve(resData);
        } catch (e) {
            reject(e);
        }
    })
}
let createPayment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resData = {};
            let checkTransId = await db.Payment.findOne({
                where: { transId: data.transId, doctor_id: data.doctor_id }
            })
            if (checkTransId) {
                resData.errCode = 1;
                resData.message = 'Mã giao dịch đã tồn tại';
                resolve(resData);
                return;
            }
            console.log('Bắt đầu tạo payment');
            let payment = await db.Payment.create({
                doctor_id: data.doctor_id,
                datePayment: data.datePayment,
                monthlyFee: data.monthlyFee,
                appointmentFee: data.appointmentFee,
                totalPayment: data.totalPayment,
                monthly: data.monthly,
                transId: data.transId
            })

            if (payment) {
                try {
                    console.log('tạo thành công payment');
                    if (payment.monthlyFee != 0) {
                        await DoctorService.updatePaidDoctor(payment.doctor_id, payment.monthly)
                    }
                    if (payment.appointmentFee != 0) {
                        await AppointmentService.updatePaymentIdAppointment(payment.doctor_id, payment.id, payment.datePayment)
                    }
                    resData.errCode = 0;
                    resData.message = payment;
                } catch (error) {
                    resData.errCode = 2;
                    console.log(error);
                    resData.message = error;
                }

            }
            resolve(resData);
        } catch (e) {
            reject(e);
        }
    })
}
let getAllPayment = (key, page, limit, begin, end) => {
    return new Promise(async (resolve, reject) => {
        try {
            page = page - 0;
            limit = limit - 0;
            let offset = page * limit;
            let requirementDate = {};
            if (begin !== '') {
                let dateStart = new Date(begin);
                let dateEnd = new Date();
                if (end !== '') {
                    dateEnd = new Date(end);
                    dateEnd.setHours(dateEnd.getHours() - 7);
                }
                dateStart.setHours(dateStart.getHours() - 7);
                console.log(dateStart, dateEnd);
                requirementDate = {
                    datePayment: {
                        [Op.between]: [dateStart, dateEnd]
                    }
                }
            }
            const { count, rows } = await db.Payment.findAndCountAll({
                include:
                {
                    model: db.Doctor,
                    required: true,
                    as: 'doctor',
                    attributes: ['id'],
                    include:
                    {
                        model: db.User,
                        required: true,
                        as: 'user',
                        attributes: ['firsname', 'lastname'],
                        where: {
                            [Op.or]: [
                                { name: db.sequelize.where(db.sequelize.fn('concat', db.sequelize.col('firsname'), " ", db.sequelize.col('lastname')), 'LIKE', '%' + key + '%') },
                            ]
                        },
                    },
                },
                where: requirementDate,
                order: [
                    ['datePayment', 'DESC']
                ],
                offset: offset,
                limit: limit,
                raw: true,
                nest: true
            })
            let resData = {};
            resData.payment = rows;
            resData.limit = limit;
            resData.totalPages = Math.ceil(count / limit);
            resData.totalElements = count
            resData.page = page;
            resolve(resData);
        } catch (error) {
            reject(error);
        }
    })

}
let getPaymentById = (id, userId, role_name) => {
    return new Promise(async (resolve, reject) => {
        try {
            // let [row] = await db.Doctor.update(
            //     {
            //         paid: null
            //     },
            //     {
            //         where: {paid: {[Op.ne]: null}}
            //     }
            // )
            // console.log('so bac si da sua ',row);
            // let [row2] = await db.Appointment.update(
            //     {
            //         paymentId: null
            //     },
            //     {
            //         where: {paymentId: {[Op.ne]: null}}
            //     }
            // )
            // console.log('so appointment da sua ',row2);
            // await db.Payment.destroy({
            //     where: {datePayment: {[Op.lt]: new Date()}}
            // })
            let resData = {};
            let requirement = {};

            if (role_name !== "ROLE_ADMIN") {
                let doctor = await db.Doctor.findOne({
                    attributes: ['id'],
                    include:
                    {
                        model: db.User,
                        required: true,
                        as: 'user',
                        where: { id: userId }
                    }
                })
                if (!doctor) {
                    resData.errCode = 1;
                    resData.message = 'Bạn không có quyền xem giao dịch này';
                    resolve(resData);
                    return;
                }

                requirement = {
                    doctor_id: doctor.id
                }
            }
            let payment = await db.Payment.findOne({
                include:
                {
                    model: db.Appointment,
                    require: true,
                    as: 'appointment',
                },
                where: [{ id: id }, requirement]
            })

            if (!payment) {
                resData.errCode = 2;
                resData.message = 'Không tìm thấy giao dịch';
                resolve(resData);
                return;
            }
            resData.errCode = 0;
            resData.message = payment;
            resolve(resData);
        } catch (error) {
            reject(error);
        }
    })
}
let getPaymentOfDoctor = (doctorId, page, limit, begin, end) => {
    return new Promise(async (resolve, reject) => {
        try {
            page = page - 0;
            limit = limit - 0;
            let offset = page * limit;
            let requirementDate = {};
            if (begin !== '') {
                let dateStart = new Date(begin);
                let dateEnd = new Date();
                if (end !== '') {
                    dateEnd = new Date(end);
                    dateEnd.setHours(dateEnd.getHours() - 7);
                }
                dateStart.setHours(dateStart.getHours() - 7);
                console.log(dateStart, dateEnd);
                requirementDate = {
                    datePayment: {
                        [Op.between]: [dateStart, dateEnd]
                    }
                }
            }
            const { count, rows } = await db.Payment.findAndCountAll({
                include:
                {
                    model: db.Appointment,
                    require: true,
                    as: 'appointment',
                },
                where: [{ doctor_id: doctorId }, requirementDate],
                order: [
                    ['datePayment', 'DESC']
                ],
                offset: offset,
                limit: limit,
                raw: true,
                nest: true
            })
            let resData = {};
            resData.payment = rows;
            resData.limit = limit;
            resData.totalPages = Math.ceil(count / limit);
            resData.totalElements = count
            resData.page = page;
            resolve(resData);
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    doctorPayment,
    createPayment,
    getAllPayment,
    getPaymentById,
    getPaymentOfDoctor
}