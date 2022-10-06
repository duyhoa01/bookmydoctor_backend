const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const dotenv = require('dotenv'); 
const AuthService = require('../service/AuthService');
const userService= require('../service/UserService');
const patientService=require('../service/PatientService');

const multer = require('multer')
const path = require('path')

dotenv.config();
let refreshToken = [];

let authenToken = (req,res,next) => {
    const token = req.headers['token'];
    console.log(token);
    if(!token) res.sendStatus(401); // khong co token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        console.log(err, data);       
        if (err) res.sendStatus(403); // khong co quyen truy cap chuc nang
        next();
    });
};


let handleLogin = async (req,res) => {
    const {email,password} = req.body;
    const data={
        email,
        password
    }
    if(!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing username or password'

        })
    }
    let userData = await AuthService.handleUserLogin(email,password);
    let accessToken = {};

    if (userData.errCode === 0 && userData.status === 1){
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
    if (!req.body.email || !req.body.password || !req.body.firsname || !req.body.lastname || !req.body.gender || !req.body.phoneNumber || !req.body.age  ) {
        return res.status(400).json({
            erroCode:1,
            message:'nhap day du thong tin'
        })
    }
    if (!req.file){
        return res.status(400).json({
            erroCode:1,
            message:'vui long tai len file anh'
        })
    }
    req.body.status='0';
    req.body.image=req.file.path;
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
    upload: upload,
    authenToken: authenToken,
    handleLogin: handleLogin,
}
