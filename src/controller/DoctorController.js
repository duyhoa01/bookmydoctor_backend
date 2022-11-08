const doctorService = require('../service/DoctorService');

let getAllDoctor = async(req,res) => {
    let key;
    if( req.query.key === undefined){
        key = ''
    } else{
        key= req.query.key
    }
    let pageNumber = req.query.page === undefined ? 0: req.query.page;
    let limit = req.query.limit === undefined ? 10 : req.query.limit;

    let resData = await doctorService.getAllDoctor(key, pageNumber, limit);

    let page ={};
    page.size= resData.size;
    page.totalPages= resData.totalPages;
    page.totalElements = resData.totalElements;
    page.page = resData.page;
    return res.status(200).json({
        erroCode:0,
        message: 'OK',
        page: page,
        doctor: resData.doctor,
    })
}
let getDoctorById = async(req,res) => {
    let id = parseInt(req.params.id);
    if (id) {
        let doctor = await doctorService.getDoctorById(id);
        // Tim thay doctor co id truyen vao
        if(doctor){
            return res.status(200).json({
                errCode: 0,
                message: doctor,
            })
        }
        // Khong tim thay doctor
        else {
            return res.status(404).json({
                errCode: 1,
                message: 'Không tìm thấy doctor có id này',
            })
        }
    // Chua truyen tham so id doctor
    } else {
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }
}
let createDoctor = async(req,res) => {
    if (!req.body.email || !req.body.password || !req.body.firsname || !req.body.lastname 
        || !req.body.gender || !req.body.phoneNumber || !req.body.birthday || !req.body.address  
        || !req.body.description || !req.body.hospital_id || !req.body.clinic_id || !req.body.specialty_id ) {
        return res.status(400).json({
            erroCode:1,
            message:'Nhập thiếu thông tin'
        })
    } else {
        if (!req.file){
            if(req.body.gender=== '1'){
                req.body.image='https://res.cloudinary.com/drotiisfy/image/upload/v1665540808/profiles/male_default_avatar.jng_tgqrqf.jpg'
            } else {
                req.body.image='https://res.cloudinary.com/drotiisfy/image/upload/v1665540809/profiles/female_defaule_avatar_ezuxcv.jpg'
            }
            
        } else{
            req.body.image=req.file.path;
        }
        let data = req.body;
        let doctorData = await doctorService.createDoctor(data);
        if (doctorData.errCode == 0) {
            return res.status(200).json({
                errCode: doctorData.errCode,
                message: doctorData.errMessage,
                doctor: doctorData.doctor
            })
        } else if (doctorData.errCode === 404){
            return res.status(404).json({
                errCode: doctorData.errCode,
                message: doctorData.errMessage,
            })
        } else {
            return res.status(400).json({
                errCode: doctorData.errCode,
                message: doctorData.errMessage,
            })
        }
    }
}
let updateDoctor = async (req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            errCode: "1",
            errMessage: "Thiếu tham số id"
        })
    } else {
        if (!req.body.firsname || !req.body.lastname 
            || !req.body.gender || !req.body.phoneNumber || !req.body.birthday || !req.body.address  
            || !req.body.description || !req.body.rate || !req.body.hospital_id || !req.body.clinic_id || !req.body.specialty_id ) {
            return res.status(400).json({
                erroCode:1,
                message:'Nhập thiếu thông tin'
            })
        }
        if (!req.file){
            req.body.image='0';
        } else{
            req.body.image=req.file.path;
        }
        let data = req.body;
        data.id = id;
        let doctorData = await doctorService.updateDoctor(data);
        if (doctorData.errCode == 2) {
            return res.status(404).json({
                errCode: doctorData.errCode,
                message: doctorData.errMessage,
            })
        } else if (doctorData.errCode === 404){
            return res.status(404).json({
                errCode: doctorData.errCode,
                message: doctorData.errMessage,
            })
        } else {
            return res.status(200).json({
                errCode: doctorData.errCode,
                message: doctorData.errMessage,
            })
        }
    }
}

let deleteDoctor = async(req, res) => {
    let id = req.params.id;
    if(!id){
        return res.status(400).json({
            errCode: 1,
            errMessage: "Thiếu tham số id"
        })
    } else {
        let doctorData = await doctorService.deleteDoctor(id);
        if (doctorData.errCode == 2) {
            return res.status(404).json({
                errCode: doctorData.errCode,
                message: doctorData.errMessage,
            })
        } else {
            return res.status(200).json({
                errCode: doctorData.errCode,
                message: doctorData.errMessage,
            })
        }
    }
}
let getDoctorBySpecialty = async(req,res) => {
    let id = req.params.id;
    if (!id){
        return res.status(400).json({
            errCode: "1",
            errMessage: "Thiếu tham số id"
        })
    } else {
        let key;
        if( req.query.key === undefined){
            key = ''
        } else{
            key= req.query.key
        }
        let pageNumber = req.query.page === undefined ? 0: req.query.page;
        let limit = req.query.limit === undefined ? 10 : req.query.limit;
        
        let resData = await doctorService.getDoctorBySpecialty(id, key, pageNumber, limit);
        let page ={};
        page.size= resData.size;
        page.totalPages= resData.totalPages;
        page.totalElements = resData.totalElements;
        page.page = resData.page;
        return res.status(200).json({
            erroCode:0,
            message: 'OK',
            page: page,
            doctor: resData.doctor,
        })
    }
}
let getDoctorByHospital = async(req,res) => {
    let id = req.params.id;
    if (!id){
        return res.status(400).json({
            errCode: "1",
            errMessage: "Thiếu tham số id"
        })
    } else {
        let key;
        if( req.query.key === undefined){
            key = ''
        } else{
            key= req.query.key
        }
        let pageNumber = req.query.page === undefined ? 0: req.query.page;
        let limit = req.query.limit === undefined ? 10 : req.query.limit;
        
        let resData = await doctorService.getDoctorByHospital(id, key, pageNumber, limit);
        let page ={};
        page.size= resData.size;
        page.totalPages= resData.totalPages;
        page.totalElements = resData.totalElements;
        page.page = resData.page;
        return res.status(200).json({
            erroCode:0,
            message: 'OK',
            page: page,
            doctor: resData.doctor,
        })
    }
}
module.exports = {
    getAllDoctor: getAllDoctor,
    getDoctorById: getDoctorById,
    createDoctor: createDoctor,
    updateDoctor: updateDoctor,
    deleteDoctor: deleteDoctor,
    getDoctorBySpecialty: getDoctorBySpecialty,
    getDoctorByHospital: getDoctorByHospital,
}