const db = require('../models');
const messageService = require('../service/MessageService')

let addMessage = async (req,res) => {
    if (!req.file){
        req.body.image= ''
    } else{
        req.body.image=req.file.path;
    }
    if ( !req.body.from_user || !req.body.to_user || (req.body.image == '' &&  !req.body.text)   ) {
        return res.status(400).json({
            erroCode:1,
            message:'nhập đầy đủ thông tin'
        })
    }
    req.body.userID = req.userID
    let message = await messageService.addMessage(req.body);
    if(message.errorCode ==4){
        return res.status(403).json(message);   
    } else if(message.errorCode ==2){
        return res.status(404).json(message);   
    } else
    return res.status(200).json(message);
}

let getListMessageChat = async (req,res) => {
    let pageNumber = req.query.page === undefined ? 0: req.query.page
    let size = req.query.size === undefined ? 20 : req.query.size
    req.query.userID = req.userID
    let resData = await messageService.getListMessage(req.query,pageNumber,size)
    if(resData.errorCode==4){
        return res.status(403).json(resData); 
    }
    let page ={}
    page.size= resData.size
    page.totalPages= resData.totalPages
    page.totalElements = resData.totalElements
    page.page = resData.page
    return res.status(200).json({
        erroCode:0,
        message: 'OK',
        messages: resData.messages,
        page: page
    })
}

module.exports ={
    addMessage,
    getListMessageChat
}