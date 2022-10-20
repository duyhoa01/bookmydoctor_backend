let appointmentService = require('../service/AppointmentService');

let createAppointment = async(req, res) => {
    if (!req.body.user_id || !req.body.schedule_id || !req.body.sysmptoms){
        res.status(404).json({message: 'Nhập thiếu thông tin'});       
    }
    let resData = await appointmentService.createAppointment(req.body);
    if(resData.errCode === 0){
        res.status(200).json(resData);
    }
    if(resData.errCode === 1){
        res.status(401).json(resData);
    }
    if(resData.errCode === 2){
        res.status(404).json(resData);
    }
}

module.exports = {
    createAppointment: createAppointment,
}