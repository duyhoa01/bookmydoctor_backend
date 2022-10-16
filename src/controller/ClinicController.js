const db = require('../models');
const clinicService = require('../service/ClinicService');

let createClinic = async(req, res) => { 
    if (!req.body.name || !req.body.street || !req.body.city){
        return res.status(400).json({
            erroCode:1,
            message:'Nhập thiếu thông tin'
        })
    }
    if (!req.file){
        req.body.image='https://res.cloudinary.com/drotiisfy/image/upload/v1665540808/profiles/male_default_avatar.jng_tgqrqf.jpg';
    } else {
        req.body.image=req.file.path;
    }
    let data = req.body;
    let clinicData = await clinicService.createClinic(data);
    if (clinicData.errCode == 0) {
        return res.status(200).json({
            errCode: clinicData.errCode,
            message: clinicData.errMessage,
        })
    } else {
        return res.status(400).json({
            errCode: clinicData.errCode,
            message: clinicData.errMessage,
        })
    }
}
let getAllClinic = async(req, res) => {
    let key = req.query.key === undefined ? '' : req.query.key;
    let pageNumber = req.query.page === undefined ? 0: req.query.page;
    let limit = req.query.limit === undefined ? 10 : req.query.limit;
    let resData = await clinicService.getAllClinic(key, pageNumber, limit);

    let page ={};
    page.size= resData.size;
    page.totalPages= resData.totalPages;
    page.totalElements = resData.totalElements;
    page.page = resData.page;
    return res.status(200).json({
        erroCode:0,
        message: 'OK',
        page: page,
        clinic: resData.clinic,
    })
}
let getClinicById = async(req,res) => {
    let id = parseInt(req.params.id);
    if (id) {
        let Clinic = await clinicService.getClinicById(id);
        // Tim thay Clinic co id truyen vao
        if(Clinic){
            return res.status(200).json({
                errCode: 0,
                message: Clinic,
            })
        }
        // Khong tim thay Clinic
        else {
            return res.status(404).json({
                errCode: 1,
                message: 'Không tìm thấy phòng khám có id này',
            })
        }
    // Chua truyen tham so id Clinic
    } else {
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }
}
let searchClinic = async (req, res) => {
    let key = req.query.key === undefined ? '' : req.query.key;
    let clinic = await clinicService.searchClinic(key);
    if(clinic){
        return res.status(200).json({
            errCode: 0,
            message: clinic,
        })
    }
    // Khong tim thay Clinic
    else {
        return res.status(404).json({
            errCode: 1,
            message: 'Không tồn tại phòng khám này',
        })
    }

}
let updateClinic = async(req, res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).json({
            errCode: "1",
            errMessage: "Thiếu tham số id"
        })
    }
    if (!req.body.name || !req.body.street || !req.body.city){
        return res.status(400).json({ message: 'Nhập thiếu tham số'});
    }
    if (!req.file){
        req.body.image='0'; 
    } else{
        req.body.image=req.file.path;
    }
    let resData = await clinicService.updateClinic(id,req.body);
    if (resData.errCode === 0){
        return res.status(200).json({message: resData.errMessage});
    }
    return res.status(404).json({message: resData.errMessage});
}
let deleteClinic = async(req, res) => {
    let id = req.params.id;
    if (!id){
        return res.status(400).json({message: 'Thiếu tham số id'});
    }
    let resData = await clinicService.deleteClinic(id);
    if (resData.errCode === 1){
        return res.status(404).json({message: resData.errMessage});
    }
    return res.status(200).json({message: resData.errMessage});
}
module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getClinicById: getClinicById,
    searchClinic: searchClinic,
    updateClinic: updateClinic,
    deleteClinic: deleteClinic,
}