const paymentService = require('../service/PaymentService');
const db = require('../models/index');


let getAllPayment = async(req, res) => {
    let key = req.query.key === undefined ? '' : req.query.key;
    let pageNumber = req.query.page === undefined ? 0: req.query.page;
    let limit = req.query.limit === undefined ? 20 : req.query.limit;
    let begin = req.query.begin === undefined ? '' : req.query.begin;
    let end = req.query.end === undefined ? '' : req.query.end;
    let resData = await paymentService.getAllPayment(key, pageNumber, limit, begin, end);
    let page ={};
    page.size= resData.size;
    page.totalPages= resData.totalPages;
    page.totalElements = resData.totalElements;
    page.page = resData.page;
    return res.status(200).json({
        erroCode:0,
        message: 'OK',
        page: page,
        payment: resData.payment,
    })
}
let doctorPayment = async(req, res) => {
    let doctorId = req.params.id;
    if (!doctorId){
        return res.status(400).json({
            message:'thiếu id doctor'
        })
    }
    let resData = await paymentService.doctorPayment(doctorId);
    if (resData.errCode === 0) return res.status(200).json({message: resData.message});
    if (resData.errCode === 1) return res.status(404).json({message: resData.message});
}
let getPaymentById = async (req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            errCode: "1",
            errMessage: "Thiếu tham số id"
        })
    }
    let resData = await paymentService.getPaymentById(id, req.userID, req.role_name);
    if (resData.errCode === 0) {
        return res.status(200).json({message: resData.message});
    }
    if (resData.errCode === 1) {
        return res.status(403).json({message: resData.message});
    }
    if (resData.errCode === 2) {
        return res.status(404).json({message: resData.message});
    }
}
let getPaymentOfDoctor = async (req, res) => {
    let doctorId = req.params.id;
    if(!doctorId) {
        return res.status(400).json({
            errCode: "1",
            errMessage: "Thiếu tham số id doctor"
        })
    }
    let resData = await paymentService.getPaymentOfDoctor(doctorId, req.userID, req.role_name);
    if (resData.errCode === 0) {
        return res.status(200).json({message: resData.message});
    }
}
module.exports = {
    doctorPayment,
    getAllPayment,
    getPaymentById,
    getPaymentOfDoctor,
}