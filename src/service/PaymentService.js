const { QueryTypes } = require('sequelize');
const db = require('../models/index');
const { Op, where } = require('sequelize');
const doctorService = require('./DoctorService');
const appointmentService = require('./AppointmentService');

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
                    console.log('kết quả tạo\n', payment);
                    if (payment.monthlyFee != 0) {
                        await doctorService.updatePaidDoctor(payment.doctor_id, payment.monthly);
                        console.log('cập nhật thông tin bác sĩ thành công');
                    }
                    if (payment.appointmentFee != 0) {
                        await appointmentService.updatePaymentIdAppointment(payment.doctor_id, payment.id, payment.datePayment);
                        console.log('cập nhật thông tin appointment thành công');
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
                // include:
                // {
                //     model: db.Appointment,
                //     required: true,
                //     as: 'appointment',
                // },
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
let getAllInfoPayment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resData = {};
            let pageNumber = data.pageNumber - 0;
            let size = data.size - 0;
            await db.sequelize.query("SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'");
            let query = `select table3.*, table4.monthlyFee from
            (select doctor_id, CONCAT(u.firsname, ' ', u.lastname) as name, u.phoneNumber, u.email, done, revenue, paid 
                        from
                        (select table1.id as doctor_id, table1.user_id, table1.paid as date_payment, table1.sum_apponintment as revenue, table1.count_appointment as done, sum(sch_paid.cost) as paid from
                        (select Doctors.id, Doctors.user_id, Doctors.paid, sum(sch.cost) as sum_apponintment, count(sch.id) as count_appointment from Doctors 
                        left join 
                        (Select Schedules.id, Schedules.cost, Schedules.doctor_id from Schedules inner join
                        (select a.Schedule_id
                        from (select Appointments.id, Appointments.Schedule_id, Appointments.status_id from Appointments where ((Appointments.date between :beginDate and :endDate))) a 
                        inner join Statuses on a.status_id = Statuses.id
                        where Statuses.name = "DONE") ap
                        on Schedules.id = ap.Schedule_id) sch
                        on sch.doctor_id = Doctors.id
                        group by Doctors.id) as table1
                        left join 
                        (Select Schedules.id, Schedules.cost, Schedules.doctor_id from Schedules inner join
                        (select a.Schedule_id
                        from (select Appointments.id, Appointments.Schedule_id, Appointments.status_id from Appointments where ((Appointments.date between :beginDate and :endDate) and Appointments.paymentId is not null)) a 
                        inner join Statuses on a.status_id = Statuses.id
                        where Statuses.name = "DONE") ap
                        on Schedules.id = ap.Schedule_id) sch_paid
                        on sch_paid.doctor_id = table1.id
                        group by table1.id) table2
                        inner join Users as u on u.id = table2.user_id ) table3
            inner join 
            (select Doctors.id, p.monthlyFee from Doctors
            left join (select Payments.doctor_id, Payments.monthlyFee from Payments where ((Payments.datePayment between :beginDate and :endDate) and Payments.monthlyFee > 0)) p
            on p.doctor_id = Doctors.id) table4
            on table3.doctor_id = table4.id
            order by revenue desc`
            let resQuery = await db.sequelize.query(query, { replacements: { beginDate: data.begin, endDate: data.end}, type: QueryTypes.SELECT })
            let arr = Array.from(resQuery)
            arr.forEach(d => {
                d.revenue = d.revenue === null ? 0 : d.revenue;
                d.done = d.done === null ? 0 : d.done;
                d.profits = d.revenue * 0.9;
                d.paid = d.paid === null ? 0 : d.paid * 0.1;
                d.unpaid = d.revenue * 0.1 - d.paid;
                d.monthlyFee = d.monthlyFee === null ? 0 : d.monthlyFee;
                return d;
            })
            let numberOfDoctor = 0;
            let sumRevenue = 0;
            let sumProfits = 0;
            let sumPaid = 0;
            let sumUnpaid = 0;
            let sumAppointmentDone = 0;
            let sumMonthlyFee = 0;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i]["monthlyFee"] > 0) numberOfDoctor += 1;
                sumRevenue += arr[i]["revenue"];
                sumProfits += arr[i]["profits"];
                sumPaid += arr[i]["paid"];
                sumUnpaid += arr[i]["unpaid"];
                sumAppointmentDone += arr[i]["done"];
                sumMonthlyFee += arr[i]["monthlyFee"];
            }
            let companyProfit = sumMonthlyFee + sumPaid;
            resData.statistics = {
                numberOfDoctor,
                sumAppointmentDone,
                sumRevenue,
                sumProfits,
                sumPaid,
                sumUnpaid,
                sumMonthlyFee,
                companyProfit
            }
            let length = arr.length;
            const offset = pageNumber * size;
            let lengthArrResult = length-(offset+size) > 0 ? size : (length - offset);
            var arrResult = [];
            for (var i = 0; i < lengthArrResult; i++) {
                arrResult[i] = arr[i+offset];
            }
            resData.data = arrResult;
            resData.size = size;
            resData.totalPages = Math.ceil(length / size);
            resData.totalElements = length;
            resData.page = pageNumber;
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
    getPaymentOfDoctor,
    getAllInfoPayment
}