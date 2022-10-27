const hospitalService = require('../service/hospitalService');

let createHospital = async(req, res) => { 
    console.log('controller');
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
    let hospitalData = await hospitalService.createHospital(data);
    if (hospitalData.errCode == 0) {
        return res.status(200).json({
            errCode: hospitalData.errCode,
            message: hospitalData.errMessage,
        })
    } else {
        return res.status(400).json({
            errCode: hospitalData.errCode,
            message: hospitalData.errMessage,
        })
    }
}
let getAllHospital = async(req, res) => {
    let key = req.query.key === undefined ? '' : req.query.key;
    let pageNumber = req.query.page === undefined ? 0: req.query.page;
    let limit = req.query.limit === undefined ? 10 : req.query.limit;
    let resData = await hospitalService.getAllHospital(key, pageNumber, limit);

    let page ={};
    page.size= resData.size;
    page.totalPages= resData.totalPages;
    page.totalElements = resData.totalElements;
    page.page = resData.page;
    return res.status(200).json({
        erroCode:0,
        message: 'OK',
        page: page,
        hospital: resData.hospital,
    })
}
let getHospitalById = async(req,res) => {
    let id = parseInt(req.params.id);
    if (id) {
        let Hospital = await hospitalService.getHospitalById(id);
        // Tim thay Hospital co id truyen vao
        if(Hospital){
            return res.status(200).json({
                errCode: 0,
                message: Hospital,
            })
        }
        // Khong tim thay Hospital
        else {
            return res.status(404).json({
                errCode: 1,
                message: 'Không tìm thấy bệnh viện có id này',
            })
        }
    // Chua truyen tham so id Hospital
    } else {
        return res.status(400).json({
            errCode: 1,
            message: 'Thiếu tham số id',
        })
    }
}
let searchHospital = async (req, res) => {
    let key = req.query.key === undefined ? '' : req.query.key;
    let hospital = await hospitalService.searchHospital(key);
    if(hospital){
        return res.status(200).json({
            errCode: 0,
            message: hospital,
        })
    }
    // Khong tim thay Hospital
    else {
        return res.status(404).json({
            errCode: 1,
            message: 'Không tồn tại bệnh viện này',
        })
    }

}
let updateHospital = async(req, res) => {
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
    let resData = await hospitalService.updateHospital(id,req.body);
    if (resData.errCode === 0){
        return res.status(200).json({message: resData.errMessage});
    }
    return res.status(404).json({message: resData.errMessage});
}
let deleteHospital = async(req, res) => {
    let id = req.params.id;
    if (!id){
        return res.status(400).json({message: 'Thiếu tham số id'});
    }
    let resData = await hospitalService.deleteHospital(id);
    if (resData.errCode === 1){
        return res.status(404).json({message: resData.errMessage});
    }
    return res.status(200).json({message: resData.errMessage});
}
module.exports = {
    createHospital: createHospital,
    getAllHospital: getAllHospital,
    getHospitalById: getHospitalById,
    searchHospital: searchHospital,
    updateHospital: updateHospital,
    deleteHospital: deleteHospital,
}