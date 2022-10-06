const db= require('../models');
const userService = require('./UserService')

    let createPatient = async (data)=>{
        return new Promise( async (resolve, reject)=>{
            try{
                let response= await userService.createNewUser(data);
                console.log(response)
                if(response.errCode===0){
                    const patient= await db.Patient.create(
                        {
                           user_id: response.message.id
                        }
                    )
                    resolve({
                        errCode: 0,
                        message: patient
                    });
                } else {
                    resolve(response);
                }
                
            } catch(e){
                reject(e);
            }
        })
    }

module.exports= {
    createPatient:createPatient
}