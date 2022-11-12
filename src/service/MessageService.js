const db = require("../models");
const { Op } = require('sequelize');

let addMessage = async (data) => {
    return new Promise( async (resolve, reject)=>{
        try{
            let message = await db.MessageChat.create({
                from_user: data.from_user,
                to_user: data.to_user,
                text: data.text,
                image: data.image,
                date: Date.now()
            })
            let returnMessage = await db.MessageChat.findByPk(message.id,
                {
                    include:[
                        {
                            model: db.User,
                            require: true,
                            as: 'fromUser',
                            attributes: {
                                exclude: ['password', 'token']
                            },
                        },
                        {
                            model: db.User,
                            require: true,
                            as: 'toUser',
                            attributes: {
                                exclude: ['password', 'token']
                            },
                        },
                    ],
                    attributes: {
                        exclude: ['collaborator_id']
                    },
                }
            )
            resolve({
                errorCode:0,
                message: returnMessage
            })
        } catch (e){
            reject(e)
        }
    });
}

let getListMessage = async (data) => {
    return new Promise( async (resolve, reject)=>{
        try{
            console.log(data)
            let messages = await db.MessageChat.findAll(
                {
                    where:{
                        [Op.or]:[
                            {  [Op.and]:[ {from_user: data.from_user},{to_user: data.to_user}] },
                            {  [Op.and]:[ {from_user: data.to_user},{to_user: data.from_user}] },
                        ]
                    },
                    include:[
                        {
                            model: db.User,
                            require: true,
                            as: 'fromUser',
                            attributes: {
                                exclude: ['password', 'token']
                            },
                        },
                        {
                            model: db.User,
                            require: true,
                            as: 'toUser',
                            attributes: {
                                exclude: ['password', 'token']
                            },
                        },
                    ],
                    order: [
                        ['date', 'DESC']
                    ],
                    attributes: {
                        exclude: ['collaborator_id']
                    },
                }
            )
            resolve({
                errorCode:0,
                message: messages
            })
        } catch(e){
            reject(e)
        }
    });
}

module.exports = {
    addMessage,
    getListMessage
}