const db = require('../models');
const messageService = require('../service/MessageService')

let addMessage = async (req,res) => {
    if (!req.file){
        req.body.image= ''
    } else{
        req.body.image=req.file.path;
    }
    console.log(req.body)
    let message = await messageService.addMessage(req.body);
    return res.status(200).json(message);
}

let getListMessageChat = async (req,res) => {
    let messages = await messageService.getListMessage(req.query)
    return res.status(200).json(messages)
}

module.exports ={
    addMessage,
    getListMessageChat
}