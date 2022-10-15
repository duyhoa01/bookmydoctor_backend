const userService = require('../service/UserService')

let changePassword = async (req,res) =>{
    if(!req.body.password || !req.body.newPassword){
        return res.status(400).json({
            erroCode:1,
            message:'nhap day du thong tin'
        })  
    }
    console.log(req.params)
    let response= await userService.changePassword(req.params,req.body)
    if(response.errCode == 4){
        return res.status(401).json(response)
    } else {
        return res.status(200).json(response)
    }
}

let updateInforUser = async (req,res) =>{
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

    let resData = await userService.updateUser(req.params,req.body)
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


module.exports ={
    changePassword,
    updateInforUser
}