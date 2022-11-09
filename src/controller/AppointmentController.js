let appointmentService = require('../service/AppointmentService');

let createAppointment = async(req, res) => {
    if (!req.userID || !req.body.schedule_id || !req.body.symptom){
        res.status(404).json({message: 'Nhập thiếu thông tin'});       
    }
    req.body.user_id = req.userID;
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
    if(resData.errCode === 3){
        res.status(400).json(resData);
    }
}
let getAllAppointments = async(req, res) => {
    let key;
    if( req.query.key === undefined){
        key = ''
    } else{
        key= req.query.key
    }
    let rate = req.query.rate === undefined ? 0 : req.query.rate;
    let date = req.query.date === undefined ? '' : req.query.date;
    let pageNumber = req.query.page === undefined ? 0: req.query.page;
    let limit = req.query.limit === undefined ? 10 : req.query.limit;
    let status =req.query.status === undefined ? '' : req.query.status; 
    let resData = await appointmentService.getAllAppointments(key, pageNumber, limit, status, date, rate);

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
    let resData = await appointmentService.getAppointmentById(id, req.userID, req.role_name);
    if (resData.errCode === 0) {
        return res.status(200).json({
            message: resData.message
        })
    }   
    if(resData.errCode === 1) {
        return res.status(404).json({
            message: resData.message
        })
    }
    if(resData.errCode === 2) {
        return res.status(403).json({
            message: resData.message
        })
    }

}
let getAppointmentForUserByUserId = async(req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            errCode: "1",
            errMessage: "Thiếu tham số id"
        })
    }
    if(id != req.userID && req.role_name !== 'ROLE_ADMIN') {
        return res.status(403).json({
            errCode:0,
            message: 'Chỉ admin mới có quyền xem cuộc hẹn của người khác',
        })
    }
    let key = req.query.key === undefined ? "" : req.query.key;
    let rate = req.query.rate === undefined ? '' : req.query.rate;
    let date = req.query.date === undefined ? '' : req.query.date;


    let pageNumber = req.query.page === undefined ? 0: req.query.page;
    let limit = req.query.limit === undefined ? 10 : req.query.limit;
    let status =req.query.status === undefined ? '' : req.query.status; 
    let day = req.query.day === undefined ? undefined : req.query.day;
    let resData = await appointmentService.getAppointmentForUserByUserId(id, key, pageNumber, limit, status, day, date, rate);
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
    let resData = await appointmentService.acceptAppointment(id,req.userID);
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
let CanCelAppointment = async(req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            message: 'Thiếu id cuộc hẹn'
        })
    }
    let resData = await appointmentService.CanCelAppointment(id, req.userID);
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
    let resData = await appointmentService.deleteAppointment(id);
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
let ReportAppointment = async(req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            message: 'Thiếu id cuộc hẹn'
        })
    }
    let resData = await appointmentService.ReportAppointment(id, req.userID);
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
    if(resData.errCode === 0) {
        return res.status(200).json({
            message: resData.message
        })
    }
}
let AdminHandlesAppointment = async(req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            message: 'Thiếu id cuộc hẹn'
        })
    }
    let violator = req.body.violator;
    if(!violator) {
        return res.status(400).json({message: 'Thiếu tham số người vi phạm'});
    }
    let resData = await appointmentService.AdminHandlesAppointment(id, violator);
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
let PatientRatingAppointment = async(req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            message: 'Thiếu id cuộc hẹn'
        })
    }
    let scores = req.body.scores;
    scores = scores - 0;
    if (!scores) {
        return res.status(400).json({
            message: 'Thiếu tham số điểm đánh giá'
        })
    }
    if (!Number.isInteger(scores)) {
        return res.status(400).json({
            message: 'Điểm đánh giá phải là số tự nhiên từ [1,5]'
        })
    }
    if (scores < 1 || scores > 5) {
        return res.status(400).json({
            message: 'Điểm đánh giá phải là số tự nhiên từ [1,5]'
        })
    }
    let resData = await appointmentService.PatientRatingAppointment(req.userID, id, scores);
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
    CanCelAppointment: CanCelAppointment,
    deleteAppointment: deleteAppointment,
    ReportAppointment: ReportAppointment,
    AdminHandlesAppointment: AdminHandlesAppointment,
    PatientRatingAppointment

}