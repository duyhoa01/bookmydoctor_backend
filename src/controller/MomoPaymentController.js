
const momoPaymentService = require('../service/MomoPaymentService');

let Payment = async (req, res) => {
    let doctor_id = req.body.doctor_id;
    if (!doctor_id) {
        return res.status(400).json({ message: 'Thiếu id bác sĩ'});
    }
    let description = req.body.description;
    if (!description) {
        return res.status(400).json({ message: 'Thiếu tham số tên lịch khám' });
    }
    let cost = req.body.cost;
    if (!cost) {
        return res.status(400).json({ message: 'Thiếu giá tiền' });
    }
    momoPaymentService.Payment(doctor_id, description, cost)
        .then(data => {
            return res.status(200).json({ message: data.payUrl });
        })
        .catch(error => {
            return res.status(500).json({ message: error });
        });
}
let ReturnPayment = (req, res) => {
    let data = req.query;
    let resData = momoPaymentService.ReturnPayment(data);
    console.log(resData);
    if (resData.errCode == 0) {
        res.status(200).json({ message:resData.message});
    }
    if (resData.errCode == 1) {
        res.status(400).json({ message:resData.message});
    }
    if (resData.errCode == 2) {
        res.status(400).json({ message:resData.message});
    }
}
let NotifyPayment = (req, res) => {
    let data = req.body;
    let resData = momoPaymentService.NotifyPayment(data);
    if (resData.errCode == 0) {
        res.status(200).json({ message:resData.message});
    }
    if (resData.errCode == 1) {
        res.status(400).json({ message:resData.message});
    }
    if (resData.errCode == 2) {
        res.status(400).json({ message:resData.message});
    }
}
module.exports = {
    Payment,
    ReturnPayment,
    NotifyPayment
}


