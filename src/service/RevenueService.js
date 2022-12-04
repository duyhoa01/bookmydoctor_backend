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

module.exports = {
    getRevenue,
    getRevenueOfSpecialty
}