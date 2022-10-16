const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const db = require('../models/index');
dotenv.config();

let authenToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) res.sendStatus(403); // khong co token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
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
  return res.status(403).send({ message: "Cần quyền Admin" });
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
  return res.status(403).send({ message: "Cần quyền Admin!" });
}

module.exports = {
  authenToken: authenToken,
  isAdmin: isAdmin,
  isCollaborators: isCollaborators,
  isDoctor: isDoctor,
  isPatient: isPatient,
  isAdminOrYourself: isAdminOrYourself,
}
