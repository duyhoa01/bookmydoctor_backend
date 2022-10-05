const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const dotenv = require('dotenv'); 
const AuthService = require('../service/AuthService');
dotenv.config();
let refreshToken = [];

let singup = (req,res) =>{
    return res.status(200).json(
        {
            message:"create user success",
        }
    )
};

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

 module.exports = {
    singup: singup,
    authenToken: authenToken,
    handleLogin: handleLogin,
 }
