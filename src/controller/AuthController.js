const userService= require('../service/UserService');
const patientService=require('../service/PatientService');

const multer = require('multer')
const path = require('path')

let singup = async (req,res)=>{
    if (!req.body.email || !req.body.password || !req.body.firsname || !req.body.lastname || !req.body.gender || !req.body.phoneNumber || !req.body.birthday  ) {
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
    req.body.status='0';
    let message = await patientService.createPatient(req.body);
    return res.status(200).json(message);
}

let verifyUser= async(req,res)=>{
    try{
        let infor= await userService.verifyUser(req.query);
        return res.status(200).json(infor)
    }catch(e){
        return res.status(200).json({
            errCode:-1,
            errMessage:'Error from server'
        })
    }
}

//  Upload Image Controller

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: '1000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimeType && extname) {
            return cb(null, true)
        }
        cb('Give proper files formate to upload')
    }
}).single('image')


module.exports = {
    singup:singup,
    verifyUser:verifyUser,
    upload
}