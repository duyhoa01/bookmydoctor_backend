require('dotenv').config();
const nodemailer = require("nodemailer");


let sendSimpleEmail = async(dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user: process.env.EMAIL_NAME, 
            pass: process.env.EMAIL_APP_PASSWORD, 
        },
    });

    
    let info = await transporter.sendMail({
        from: '"BookMyDoctor 👻" <bookmydoctor22@gmail.com>', 
        to: dataSend.receiverEmail, 
        subject: "Xac thuc tai khoan ✔", 
        html: `
        <h3>Xin chao ${dataSend.patientName}!</h3>
        <p>vui long nhan vao link de xac minh tai khoan tren bookmydoctor</p>
        <div>
            <a href="${dataSend.redirectLink}" target="_blank">Click here</a>
        </div>
        `, 
    });
}

module.exports = {
    sendSimpleEmail
}