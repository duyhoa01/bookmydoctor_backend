const patientService=require('../service/PatientService');
const userService=require('../service/UserService')

let addPatient = async (req,res) => {
    if (!req.body.email || !req.body.password || !req.body.firsname || !req.body.lastname || !req.body.gender || !req.body.phoneNumber || !req.body.birthday || !req.body.address  ) {
        return res.status(400).json({
            erroCode:1,
            message:'nhap day du thong tin'
        })
    }
    if (!req.file){
        if(req.body.gender=== '1'){
            req.body.image='https://res.cloudinary.com/drotiisfy/image/upload/v1665540808/profiles/male_default_avatar.jng_tgqrqf.jpg'
        } else {
            req.body.image='https://res.cloudinary.com/drotiisfy/image/upload/v1665540809/profiles/female_defaule_avatar_ezuxcv.jpg'
        }
        
    } else{
        req.body.image=req.file.path;
    }
    req.body.status='1';
    let message = await patientService.createPatient(req.body);
    if(message.errCode == 0){
        return res.status(200).json(message);
    } else if (message.errCode ==1){
        return res.status(409).json(message);
    }
}

let updatePatient = async (req,res) => {
    if(!req.params) {
        return res.status(200).json({
            errCode: "1",
            errMessage: "Thieu tham so id"
        })
    }

    if (!req.file){
        req.body.image='0';
    } else{
        req.body.image=req.file.path;
    }

    let resData = await patientService.updatePatient(req.params,req.body)
    if(resData.errCode == 2){
        return res.status(404).json({
            errCode:resData.errCode,
            message: resData.errMessage
        })
    } else {
        return res.status(200).json({
            errCode:resData.errCode,
            message: resData.errMessage
        })
    }
    
}

let getPatients = async (req,res) => {
    let key;
    if( req.query.key === undefined){
        key = ''
    } else{
        key= req.query.key
    }
    let pageNumber = req.query.page === undefined ? 0: req.query.page
    let size = req.query.size === undefined ? 10 : req.query.size
    console.log(pageNumber,size)
    let resData = await patientService.getAllPatient(key,pageNumber,size);
    console.log(resData.patients)
    let page ={}
    page.size= resData.size
    page.totalPages= resData.totalPages
    page.totalElements = resData.totalElements
    page.page = resData.page
    return res.status(200).json({
        erroCode:0,
        message: 'OK',
        patients: resData.patients,
        page: page
    })
}

let getPatientById = async (req,res) => {
    let response = await patientService.getPatientById(req.params);
    if(response.errCode == 2){
        return res.status(404).json(response)
    } else{
        return res.status(200).json(response)
    }
   
}

let deletePatientById = async (req,res) => {
    let response= await patientService.deletePatientById(req.params);
    if(response.errCode == 2){
        return res.status(404).json(response)
    } else{
        return res.status(200).json(response)
    }
}

let getIdPatientFromIdUser = async (req,res) =>{
    let response= await patientService.getIdPatientFromIdUser(req.params);
    return res.status(404).json(response)
}

module.exports = {
    addPatient,
    updatePatient,
    getPatients,
    getPatientById,
    deletePatientById,
    getIdPatientFromIdUser
}