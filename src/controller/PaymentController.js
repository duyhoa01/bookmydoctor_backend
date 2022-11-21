const paymentService = require('../service/PaymentService');
const db = require('../models/index');

let createPayment = async(req, res) => {
    let doctorId = req.body.doctorId;
    if (!doctorId){
        return res.status(400).json({
            message:'thiếu id doctor'
        })
    }
    let appointmentFee = req.body.appointmentFee;
    if (!appointmentFee){
        return res.status(400).json({
            message:'thiếu thông tin tiền thanh toán phí cuộc hẹn'
        })
    }
    
    let monthly = req.body.monthly;
    if (!monthly){
        return res.status(400).json({
            message:'thiếu thông tin tháng thanh toán'
        })
    }
    let transId = req.body.transId;
    if (!transId){
        return res.status(400).json({
            message:'thiếu mã giao dịch'
        })
    }
    let resData = await paymentService.createPayment();
}
let doctorPayment = (req, res) => {
    let doctorId = req.params.id;
    if (!doctorId){
        return res.status(400).json({
            message:'thiếu id doctor'
        })
    }
    let resData = paymentService.doctorPayment(doctorId);
    

}
module.exports = {
    doctorPayment,
    createPayment
}