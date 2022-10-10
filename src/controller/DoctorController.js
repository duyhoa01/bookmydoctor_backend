const doctorService = require('../service/DoctorService');

let getAllDoctor = async(req,res) => {
    let allDoctor = await doctorService.getAllDoctor();
    return res.status(200).json({allDoctor});
}
let getDoctorById = async(req,res) => {
    let id = req.query.id;
    if (id) {
        let doctor = await doctorService.getDoctorById(req.query.id);
        // Tim thay doctor co id truyen vao
        if(!doctor){
            return res.status(200).json({
                errCode: 0,
                errMesssage: 'OK',
                data: doctor
            })
        }
        // Khong tim thay doctor
        else {
            return res.status(200).json({
                errCode: 2,
                errMesssage: 'Khong tim thay doctor co id nay',
            })
        }
    // Chua truyen tham so id doctor
    } else {
        return res.status(200).json({
            errCode: 1,
            errMesssage: 'thieu tham so id doctor',
        })
    }
}
let createDoctor = async(req,res) => {
    let data = req.body;
    let doctorData = await doctorService.createDoctor(data);
    return res.status(200).json({
        errCode: doctorData.errCode,
        errMessage: doctorData.errMessage,
    })
}
let updateDoctor = async (req, res) => {
    if(!req.body.id) {
        return res.status(200).json({
            errCode: "1",
            errMessage: "Thieu tham so id"
        })
    } else {
        let data = req.body;
        let doctorData = await doctorService.updateDoctor(data);
        return res.status(200).json({
            errCode: doctorData.errCode,
            errMessage: doctorData.errMessage,
        })
    }
}

let deleteDoctor = async(req, res) => {
    if(!req.body.id) {
        return res.status(200).json({
            errCode: "1",
            errMessage: "Thieu tham so id"
        })
    } else {
        let id = req.body.id;
        let doctorData = await doctorService.deleteDoctor(id);
        return res.status(200).json({
            errCode: doctorData.errCode,
            errMessage: doctorData.errMessage,
        })
    }
}
let getDoctorBySpecialty = async(req,res) => {
    if (!req.query.id){
        
    }
}
module.exports = {
    getAllDoctor: getAllDoctor,
    getDoctorById: getDoctorById,
    createDoctor: createDoctor,
    updateDoctor: updateDoctor,
    deleteDoctor: deleteDoctor,
    getDoctorBySpecialty: getDoctorBySpecialty,
}