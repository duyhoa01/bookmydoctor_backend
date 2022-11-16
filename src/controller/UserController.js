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

let ResetPassword = async (req,res) =>{
    if( !req.body.email ){
        return res.status(400).json({
            erroCode:1,
            message:'nhap day du thong tin'
        }) 
    }
    let resData = await userService.ResetPassword(req.body)
    if(resData.errCode == 0){
        return res.status(200).json(resData)
    } else{
        return res.status(400).json(resData)
    }
}

let enableUser = async (req,res) =>{
    let resData= await userService.enableUser(req.params);
    if(resData.errCode == 0){
        return res.status(200).json(resData)
    } if(resData.errCode == 4){
        return res.status(409).json(resData)
    } else{
        return res.status(400).json(resData)
    }
}

let disableUser = async (req,res) =>{
    let resData= await userService.disableUser(req.params);
    if(resData.errCode == 0){
        return res.status(200).json(resData)
    } if(resData.errCode == 4){
        return res.status(409).json(resData)
    } else{
        return res.status(400).json(resData)
    }
}

let getListUserChatWithUser = async (req,res) => {
    let message = await userService.getListUserChatWithUser(req.params);
    return res.status(200).json(message)
}

let getUserById = async (req,res) => {
    let resData = await userService.getUserById(req.params);
    if(resData.errCode == 2){
        return res.status(404).json(resData);
    } else{
        return res.status(200).json(resData);
    }
}

module.exports ={
    changePassword,
    updateInforUser,
    ResetPassword,
    enableUser,
    disableUser,
    getListUserChatWithUser,
    getUserById
}