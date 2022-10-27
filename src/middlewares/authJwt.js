const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const db = require('../models/index');
dotenv.config();

let authenToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) res.sendStatus(403); // khong co token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) {
      return res.sendStatus(401).send({ message: "Unauthorized!" }); // khong co quyen truy cap chuc nang
    }
    req.userID = data.id;
    req.role_name = data.role_name;
    next();
  });
};

let isAdmin = (req, res, next) => {
  if (req.role_name === 'ROLE_ADMIN') {
    next();
    return;
  }
  return res.status(403).send({ message: "Require Admin Role!" });
}

let isCollaborators = (req, res, next) => {
  if (req.role_name === 'ROLE_COLLABORATORS') {
    next();
    return;
  }
  return res.status(403).send({ message: "Require Collaborators Role!" });
};

let isDoctor = (req, res, next) => {
  if (req.role_name === 'ROLE_DOCTOR') {
    next();
    return;
  }
  return res.status(403).send({ message: "Require Doctor Role!" });
};

let isPatient = (req, res, next) => {
  if (req.role_name === 'ROLE_PATIENT') {
    next();
    return;
  }
  return res.status(403).send({ message: "Require Patient Role!" });
};
let isAdminOrYourself = async(req, res, next) => {
  let table = null;
  switch (req.role_name) {
    case 'ROLE_ADMIN': {
      next();
      return;
    }
    case 'ROLE_DOCTOR': {
      table = db.Doctor;
      break;
    }
    case 'ROLE_PATIENT': {
      table = db.Patient;
      break;
    }
    case 'ROLE_COLLABORATORS': {
      table = db.Collaborator;
      break;
    }
  }
  // Kiem tra xem co phai chinh minh dang chinh sua thong tin ca nhan hay khong
  let check = await table.findOne({
    where : { 
      id : req.params.id, 
      user_id : req.userID
    },
  });
 
  if (check) {
    next();
    return;
  }
  return res.status(403).send({ message: "Require Admin Role!!" });
}

let isAdminOrUser =async (req,res,next) =>{
  switch (req.role_name) {
    case 'ROLE_ADMIN': {
      next();
      return;
    }
  }
 
  console.log(req.userID, req.params.id,req.role_name)
  if (req.userID == req.params.id) {
    next();
    return;
  }
  return res.status(403).send({ message: "Require Admin Role!!" });
}
let authenUser = async(req, res, next) => {
  if (req.userID == req.params.id) {
    next();
    return;
  }
  return res.status(403).send({ message: "Không có quyền xem thông tin người khác" });
}

let isYourSelf_Doctor = async (req,res,next) => {
  let check = await db.Doctor.findOne({
    where : {  
      user_id : req.userID,
      id : req.body.doctor_id,
    },
  });
  if (check) {
    next();
    return;
  }
  return res.status(403).send({ message: "Bạn không có quyền này" });
}

let isDoctor_Schedule = async (req,res,next) => {
  let schedule = await db.Schedule.findByPk(req.params.id)
  if(!schedule){
    return res.status(403).send({ message: "Bạn không có quyền này" });
  }
  let check = await db.Doctor.findOne({
    where : {  
      user_id : req.userID,
      id : schedule.doctor_id,
    },
  });
  if (check) {
    next();
    return;
  }
  return res.status(403).send({ message: "Bạn không có quyền này" });
}

let isAdminOrYourSelf_Doctor = async (req,res,next) => {

  switch (req.role_name) {
    case 'ROLE_ADMIN': {
      next();
      return;
    }
  }

  let schedule = await db.Schedule.findByPk(req.params.id)
  if(!schedule){
    return res.status(403).send({ message: "Bạn không có quyền này" });
  }

  let check = await db.Doctor.findOne({
    where : {  
      user_id : req.userID,
      id : schedule.doctor_id,
    },
  });
  if (check) {
    next();
    return;
  }
  return res.status(403).send({ message: "Bạn không có quyền này" });
}

module.exports = {
  authenToken: authenToken,
  isAdmin: isAdmin,
  isCollaborators: isCollaborators,
  isDoctor: isDoctor,
  isPatient: isPatient,
  isAdminOrYourself: isAdminOrYourself,
  isAdminOrUser: isAdminOrUser,
  authenUser: authenUser,
  isYourSelf_Doctor,
  isDoctor_Schedule,
  isAdminOrYourSelf_Doctor
}
