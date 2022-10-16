const { json } = require('sequelize');
const specialtyService = require('../service/SpecialtyService')

let addSpecialty = async (req,res) =>{
    if (!req.body.name || !req.body.description  ) {
        return res.status(400).json({
            erroCode:1,
            message:'nhập đầy đủ thông tin'
        })
    }
    if (!req.file){
        return res.status(400).json({
            erroCode:1,
            message:'vui lòng tải file ảnh'
        })
    } else{
        req.body.image=req.file.path;
    }

    let resData = await specialtyService.addSpecialty(req.body)

    return res.status(200).json(resData)

}

let getAllSpecialty = async (req,res)=>{
    let key;
    if( req.query.key === undefined){
        key = ''
    } else{
        key= req.query.key
    }
    let resData = await specialtyService.getListSpecialty(key)
    return res.status(200).json(resData)
}

let deleteSpecialty = async (req,res) => {
    let resData = await specialtyService.deleteSpecialty(req.params)
    return res.status(200).json(resData)
}

let updateSpecialty = async (req,res) => {
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

    let resData = await specialtyService.updateSpecialty(req.params,req.body)
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

let getSpecialtyById = async (req,res) =>{
    let response = await specialtyService.getSpecialtyById(req.params);
    if(response.errCode == 2){
        return res.status(404).json(response)
    } else{
        return res.status(200).json(response)
    }
}

module.exports = {
    addSpecialty,
    getAllSpecialty,
    deleteSpecialty,
    updateSpecialty,
    getSpecialtyById
}