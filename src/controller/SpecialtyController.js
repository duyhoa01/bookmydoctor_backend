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

module.exports = {
    addSpecialty,
    getAllSpecialty
}