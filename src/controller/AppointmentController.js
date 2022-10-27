let appointmentService = require('../service/AppointmentService');

let createAppointment = async(req, res) => {
    if (!req.body.user_id || !req.body.schedule_id || !req.body.symptoms){
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
let getAllAppointments = async(req, res) => {
    let key;
    if( req.query.key === undefined){
        key = ''
    } else{
        key= req.query.key
    }
    let pageNumber = req.query.page === undefined ? 0: req.query.page;
    let limit = req.query.limit === undefined ? 10 : req.query.limit;
    let status =req.query.status === undefined ? '' : req.query.status; 
    let resData = await appointmentService.getAllAppointments(key, pageNumber, limit, status);

    let page ={};
    page.size= resData.size;
    page.totalPages= resData.totalPages;
    page.totalElements = resData.totalElements;
    page.page = resData.page;
    return res.status(200).json({
        errCode:0,
        message: 'OK',
        page: page,
        appointment: resData.appointment,
    })
    
}
let getAppointmentById = async(req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            errCode: "1",
            errMessage: "Thiếu tham số id"
        })
    }
    let appointment = await appointmentService.getAppointmentById(id);
    if (appointment) {
        return res.status(200).json({
            message: appointment
        })
    }   
    return res.status(404).json({
        message: 'Không tìm thấy cuộc hẹn có id này',
    })

}
let getAppointmentForUserByUserId = async(req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            errCode: "1",
            errMessage: "Thiếu tham số id"
        })
    }
    let key = req.query.key === undefined ? "" : req.query.key;

    let pageNumber = req.query.page === undefined ? 0: req.query.page;
    let limit = req.query.limit === undefined ? 10 : req.query.limit;
    let status =req.query.status === undefined ? '' : req.query.status; 
    let resData = await appointmentService.getAppointmentForUserByUserId(id, key, pageNumber, limit, status);
    let page ={};
    page.size= resData.size;
    page.totalPages= resData.totalPages;
    page.totalElements = resData.totalElements;
    page.page = resData.page;
    return res.status(200).json({
        errCode:0,
        message: 'OK',
        page: page,
        appointment: resData.appointment,
    })
}
let acceptAppointment = async(req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            message: 'Thiếu id cuộc hẹn'
        })
    }
    let resData = await appointmentService.acceptAppointment(id);
    if(resData.errCode === 1) {
        return res.status(404).json({
            message: resData.message
        })
    }
    if(resData.errCode === 2) {
        return res.status(400).json({
            message: resData.message
        })
    }
    if(resData.errCode === 3) {
        return res.status(403).json({
            message: resData.message
        })
    }
    if(resData.errCode === 0) {
        return res.status(200).json({
            message: resData.message
        })
    }
}
let ChangeStatusAppointmentToDone = async(req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            message: 'Thiếu id cuộc hẹn'
        })
    }
    let resData = await appointmentService.ChangeStatusAppointmentToDone(id);
    if(resData.errCode === 1) {
        return res.status(404).json({
            message: resData.message
        })
    }
    if(resData.errCode === 2) {
        return res.status(400).json({
            message: resData.message
        })
    }
    if(resData.errCode === 3) {
        return res.status(400).json({
            message: resData.message
        })
    }
    if(resData.errCode === 0) {
        return res.status(200).json({
            message: resData.message
        })
    }
}
let CanCelAppointment = async(req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            message: 'Thiếu id cuộc hẹn'
        })
    }
    let resData = await appointmentService.CanCelAppointment(id);
    if(resData.errCode === 1) {
        return res.status(404).json({
            message: resData.message
        })
    }
    if(resData.errCode === 2) {
        return res.status(400).json({
            message: resData.message
        })
    }
    if(resData.errCode === 3) {
        return res.status(403).json({
            message: resData.message
        })
    }
    if(resData.errCode === 0) {
        return res.status(200).json({
            message: resData.message
        })
    }
}
let deleteAppointment = async(req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            message: 'Thiếu id cuộc hẹn'
        })
    }
    let resData = await appointmentService.ChangeStatusAppointmentToDone(id);
    if(resData.errCode === 1) {
        return res.status(404).json({
            message: resData.message
        })
    }
    if(resData.errCode === 0) {
        return res.status(200).json({
            message: resData.message
        })
    }
}
module.exports = {
    createAppointment: createAppointment,
    getAllAppointments: getAllAppointments,
    getAppointmentById: getAppointmentById,
    acceptAppointment: acceptAppointment,
    getAppointmentForUserByUserId: getAppointmentForUserByUserId,
    ChangeStatusAppointmentToDone: ChangeStatusAppointmentToDone,
    CanCelAppointment: CanCelAppointment,
    deleteAppointment: deleteAppointment,

}