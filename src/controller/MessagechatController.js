const db = require('../models');
const messageService = require('../service/MessageService')

let addMessage = async (req,res) => {
    if (!req.file){
        req.body.image= ''
    } else{
        req.body.image=req.file.path;
    }
    if (!req.body.from_user || !req.body.to_user || !req.body.text  ) {
        return res.status(400).json({
            erroCode:1,
            message:'nhap day du thong tin'
        })
    }
    console.log(req.body)
    let message = await messageService.addMessage(req.body);
    return res.status(200).json(message);
}

let getListMessageChat = async (req,res) => {
    let pageNumber = req.query.page === undefined ? 0: req.query.page
    let size = req.query.size === undefined ? 20 : req.query.size
    let resData = await messageService.getListMessage(req.query,pageNumber,size)
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