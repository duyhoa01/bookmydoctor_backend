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
                            include:
                            {
                                model: db.Role,
                                required: true,
                                as: 'role'
                            },
                        },
                        {
                            model: db.User,
                            require: true,
                            as: 'toUser',
                            attributes: {
                                exclude: ['password', 'token']
                            },
                            include:
                            {
                                model: db.Role,
                                required: true,
                                as: 'role'
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

let getListMessage = async (data,pageNumber,size) => {
    return new Promise( async (resolve, reject)=>{
        try{
            pageNumber = pageNumber-0;
            size = size -0;
            let resData = {};
            const {count, rows} = await db.MessageChat.findAndCountAll(
                {
                    offset: pageNumber*size,
                    limit: size,
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
                            include:
                            {
                                model: db.Role,
                                required: true,
                                as: 'role'
                            },
                        },
                        {
                            model: db.User,
                            require: true,
                            as: 'toUser',
                            attributes: {
                                exclude: ['password', 'token']
                            },
                            include:
                            {
                                model: db.Role,
                                required: true,
                                as: 'role'
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
            resData.messages= rows;
            resData.size=size;
            resData.totalPages= Math.ceil(count/size);
            resData.totalElements=count
            resData.page = pageNumber
            resolve(resData)
        } catch(e){
            reject(e)
        }
    });
}

module.exports = {
    addMessage,
    getListMessage
}