const db = require('../models/index');
const { QueryTypes } = require('sequelize');

let getRevenue = async (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            await db.sequelize.query("SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'");
            let sql= "select sum(s.cost) as revenue , count(s.id) as done from Schedules s  LEFT JOIN Appointments a ON s.id = a.schedule_id LEFT JOIN Statuses sta ON a.status_id = sta.id where sta.name = 'DONE' and s.status = true and s.begin between :beginDate and :endDate;"
            let resData = await db.sequelize.query(sql,{ replacements: { beginDate: data.begin, endDate: data.end },type: QueryTypes.SELECT })
            let arr = Array.from(resData)
            if(arr.length == 0){
                return resolve({
                    errCode: 0,
                    message: resData
                })
            }
            let res = resData[0] 
            res.revenue= res.revenue === null ? 0: res.revenue;
            res.done= res.done === null ? 0: res.done;
            res.profits = res.revenue * 0.9;
            return resolve({
                errCode: 0,
                message: res
            })
        } catch (e) {
            reject(e)
        }
    });
}

let getRevenueOfSpecialty = async (data) => {
    return new Promise(async(resolve, reject) => {
        try {

            await db.sequelize.query("SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'");
            let sql ="select p1.id , p1.name, p2.revenue, p2.done from (select s.id, s.name from Specialties s) p1 LEFT JOIN (select spe.id as spe_id, spe.name, sum(s.cost) as revenue , count(s.id) as done from Specialties spe LEFT JOIN Doctors d ON spe.id = d.specialty_id LEFT JOIN Schedules s ON d.id = s.doctor_id LEFT JOIN Appointments a ON s.id = a.schedule_id LEFT JOIN Statuses sta ON a.status_id = sta.id where sta.name = 'DONE' and s.status = true  and s.begin between :beginDate and :endDate GROUP BY spe.id ) p2 ON p1.id = p2.spe_id ORDER BY revenue DESC;";
            let resData = await db.sequelize.query(sql,{ replacements: { beginDate: data.begin, endDate: data.end },type: QueryTypes.SELECT })
            let arr = Array.from(resData)
            arr.forEach(d => {
                d.revenue= d.revenue === null ? 0: d.revenue;
                d.done= d.done === null ? 0: d.done;
                d.profits = d.revenue * 0.9;
                return d;
            })
            return resolve({
                errCode: 0 ,
                message: resData
            })
            
        } catch (e) {
            reject(e)
        }
    });
}
let getStatisticalInfo = (data) => {
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
    getRevenue,
    getRevenueOfSpecialty,
    getStatisticalInfo
}