const db = require('../models/index');
const schedule = require('../models/schedule');
const patientService = require('../service/PatientService');
let createAppointment = (data) => {
    return new Promise(async(resolve, reject) => {
        try{
            let resData = {};
            let status = await db.Status.findOrCreate({
                where: {name: "NEW"}
            })
            // let patient = await patientService.GetPatientByUserId(data.user_id);
            // if(!patient){
            //     resData.errCode = 1;
            //     resData.message = 'Không tìm thấy bệnh nhân';
            //     resolve(resData);
            // }
            // let schedule = await ScheduleServices.getScheduleById(data.schedule_id);
            // if (!schedule) {
            //     resData.errCode = 2;
            //     resData.message = 'Không tìm thấy lịch khám';
            //     resolve(resData);
            // }
            let appointment = await db.Appointment.create({
                patient_id: patient.id,
                schedule_id: schedule.id,
                date: schedule.begin,
                sysmptoms: data.sysmptoms,
                status_id: status.id,
            });
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

module.exports = {
    createAppointment: createAppointment,
}