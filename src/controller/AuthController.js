const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const dotenv = require('dotenv'); 
const AuthService = require('../service/AuthService');
const userService= require('../service/UserService');
const patientService=require('../service/PatientService');

const multer = require('multer')
const path = require('path')

dotenv.config();

let handleLogin = async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing username or password'

        })
    }
    let userData = await AuthService.handleUserLogin(email,password);
    let accessToken = {};
    const data = {
        email: userData.user.email,
        id: userData.user.id,
        role_name: userData.user.role.name
    }
    // Kiem tra tim duoc user va acc user chua bi khoa
    if (userData.errCode === 0 && userData.user.status == 1){

        accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'});
    }
    return res.status(200).json(
        {
            errCode: userData.errCode,
            message: userData.errMessage,
            token: accessToken,
            user: userData.user ? userData.user : {}
        }
    )
};



let singup = async (req,res)=>{
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
    req.body.status='0';
    let message = await patientService.createPatient(req.body);
    if(message.errCode == 0){
        return res.status(200).json(message);
    } else if (message.errCode ==1){
        return res.status(409).json(message);
    }
    
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
    upload: upload,
    handleLogin: handleLogin,
}
