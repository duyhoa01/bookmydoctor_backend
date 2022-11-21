const db = require('../models/index');
let doctorPayment = (id) => {
    return new Promise(async(resolve, reject) => {
        try{
            let resData = {};
            const monthlyFee = 0;
            const appointmentFee = 0;
            const statusDoneId = db.Doctor.findOne({
                where: {name: "DONE"}
            })
            const doctor =  db.Doctor.findByPk(id,{
                attributes: ['paid'],
            })
            if (!doctor){
                resData.errCode = 1;
                resData.message = 'Không tìm thấy bác sĩ có id này';
                resolve(resData);
                return;
            }
            if (!doctor.paid){
                monthlyFee = process.env.monthlyFee;
            } 
            if ()
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    doctorPayment,
    createPayment
}