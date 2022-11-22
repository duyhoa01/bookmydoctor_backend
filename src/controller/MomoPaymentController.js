
const momoPaymentService = require('../service/MomoPaymentService');
const paymentService = require('../service/PaymentService');

let Payment = async(req, res) => {
    let doctorId = req.body.doctor_id;
    if (!doctorId){
        return res.status(400).json({
            message:'thiếu id doctor'
        })
    }
    let resData = await paymentService.doctorPayment(doctorId);
    if (resData.errCode === 1) return res.status(404).json({message: resData.message});
    if (resData.errCode === 0) {
        if (resData.message.totalPayment === 0) return res.status(400).json({ message: 'Số tiền thanh toán phải > 0' });
        momoPaymentService.Payment(resData.message)
            .then(data => {
                return res.status(200).json({ message: data.payUrl });
            })
            .catch(error => {
                return res.status(500).json({ message: error });
            });
    }
}
let ReturnPayment = (req, res) => {
    let data = req.query;
    let resData = momoPaymentService.ReturnPayment(data);
    console.log(resData);
    if (resData.errCode == 0) {
        res.status(200).json({ message: resData.message });
    }
    if (resData.errCode == 1) {
        res.status(400).json({ message: resData.message });
    }
    if (resData.errCode == 2) {
        res.status(400).json({ message: resData.message });
    }
}
let NotifyPayment = async (req, res) => {
    let data = req.body;
    let resData = await momoPaymentService.NotifyPayment(data);
    if (resData.errCode == 0) {
        console.log(resData.dataPayment);
        let resCreatePayment = await paymentService.createPayment(resData.dataPayment);
        if (resCreatePayment.errCode === 0) {
            return res.status(200).json({ message: resCreatePayment.message });
        }
        if (resCreatePayment.errCode === 1) {
            return res.status(400).json({
                message: resCreatePayment.message
            })
        }
        if (resCreatePayment.errCode === 2) {
            return res.status(500).json({
                message: resCreatePayment.message
            })
        }
        
    }
    if (resData.errCode == 1) {
        return res.status(400).json({ message: resData.message });
    }
    if (resData.errCode == 2) {
        return res.status(400).json({ message: resData.message });
    }
}
module.exports = {
    Payment,
    ReturnPayment,
    NotifyPayment
}


