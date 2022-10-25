const { Op, where } = require('sequelize');
const e = require('express');
const db= require('../models');

let addSchedule = async (data) =>{
    return new Promise(async(resolve, reject) => {
        try {
            // data.begin= Date.parse(data.begin)
            // data.end= Date.parse(data.end)
            data.begin= new Date(data.begin)
            data.end =  new Date(data.end)
            if(data.end<=data.begin){
                return resolve({
                    errCode: 2,
                    message:'thời gian bắt đầu phải trước thời gian kết thúc'
                })
            }
            if(await checkOverlapDateOfCreateSchedule(data,0)==true){
                return resolve({
                    errCode:3,
                    message:'thời gian bị trùng so với các kế hoạch khác'
                })
            }

            let d=(data.end- data.begin)/data.maxnumber

            if(d<20*60000){
                return resolve({
                    errCode:2,
                    message:'thời gian cho mỗi lịch khám phải tối thiểu 20 phút'
                })
            }

            let arr =[]
            let begin = data.begin
            let end = data.begin+d
            for (let i = 0; i < data.maxnumber; i++) {
                const schedule = await db.Schedule.create({
                    begin:begin,
                    end:end,
                    doctor_id: data.doctor_id,
                    cost:data.cost,
                    status:false
                })
                begin = end
                end = end+d
                arr[i]=schedule
            }
            console.log()

            return resolve({
                errCode:0,
                message: arr
            })
            

        }catch(e){
            return reject(e)
        }
    })
}

let checkOverlapDateOfCreateSchedule = async (data,key) =>{
    let schedules = await db.Schedule.findAll({
        include:{
            model: db.Doctor,
            require: true,
            as: 'doctor',
            where:{
                id: data.doctor_id
            }
        }
    });
    if(key==0){
        for(const s of schedules){
            if(checkbetwwen(s.begin,s.end,data.begin) ==true || checkbetwwen(s.begin,s.end,data.end) ==true
                || checkbetwwen(data.begin,data.end,s.begin) ==true || checkbetwwen(data.begin,data.end,s.end) ==true
                || (s.begin.getTime()===data.begin.getTime() && s.end.getTime()===data.end.getTime())){
                    return true;
                }
        }
    } else{
        for(const s of schedules){
            if( s.id == data.id){
                continue
            } 
            if(checkbetwwen(s.begin,s.end,data.begin) ==true || checkbetwwen(s.begin,s.end,data.end) ==true
                || checkbetwwen(data.begin,data.end,s.begin) ==true || checkbetwwen(data.begin,data.end,s.end) ==true
                || (s.begin==data.begin && s.end==data.end)){
                    return true;
                }
        }
    }
    
    return false;
}

let checkbetwwen = (begin,end,date) =>{
    if((end > date && begin < date)){
        return true;
    }
    return false;
}

let getListSchedule = async (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.startDate && !data.endDate){
                let schedules = await db.Schedule.findAll({
                    include:{
                        model: db.Doctor,
                        require: true,
                        as: 'doctor'
                    },
                    where:{
                        [Op.and]:[{
                            begin: {
                                [Op.between]: [data.startDate, data.endDate]
                            },
                            end: {
                                [Op.between]: [data.startDate, data.endDate]
                            }
                        }
                        ]
                    }
                });
            }
            return resolve({
                errCode:0,
                message:schedules
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getScheduleOfDoctor = async (params,data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let schedules = await db.Schedule.findAll({
                include:{
                    model: db.Doctor,
                    require: true,
                    as: 'doctor',
                    where:{
                        id: params.id
                    }
                },
                where:{
                    [Op.and]:[{
                        begin: {
                            [Op.between]: [data.startDate, data.endDate]
                        },
                        end: {
                            [Op.between]: [data.startDate, data.endDate]
                        }
                    }
                    ]
                }
            });
            return resolve({
                errCode:0,
                message:schedules
            })
        } catch (e) {
            reject(e)
        }
    })
}

let updateSchedule = async (data,param) =>{
    return new Promise(async(resolve, reject) => {
        try {
            data.begin= Date.parse(data.begin)
            data.end= Date.parse(data.end)
            let schedule = await db.Schedule.findByPk(param.id);
            data.doctor_id=schedule.doctor_id
            data.id=param.id
            if(data.end<=data.begin){
                return resolve({
                    errCode: 2,
                    message:'thời gian bắt đầu phải sau thời gian kết thúc'
                })
            }
            if(await checkOverlapDateOfCreateSchedule(data,1)==true){
                return resolve({
                    errCode:3,
                    message:'thời gian bị trùng so với các kế hoạch khác'
                })
            }

            schedule.begin = data.begin
            schedule.end = data.end
            schedule.cost = data.cost
            if(data.maxnumber > schedule.currentNumber){
                schedule.maxnumber = data.maxnumber
            }

            let upSchedule = await schedule.save()

            return resolve({
                errCode:0,
                message: upSchedule
            })
            

        }catch(e){
            return reject(e)
        }
    })
}

let getScheduleById = async (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let schedule = await db.Schedule.findOne({
                include:[
                    {
                        model: db.Doctor,
                        require: true,
                        as: 'doctor'
                    },
                    {
                        model: db.Appointment,
                        require: true,
                        as: 'appointments'
                    }
                ],
                where:{
                    id: data.id
                }
            })
            if(schedule){
                return resolve({
                    errCode:0,
                    message:schedule
                })
            } else{
                return resolve({
                    errCode:1,
                    message:'id lịch khám không tồn tại'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let deleteSchedule = async (data) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            let schedule = await db.Schedule.findByPk(data.id)
            if(!schedule){
                return resolve({
                    errCode:1,
                    message:'id lịch khám không tồn tại'
                })
            } else{
                if(schedule.currentNumber > 0){
                    return resolve({
                        errCode:2,
                        message:'lịch khám này đã có lịch hẹn với bệnh nhân'
                    })
                } else{
                    await schedule.destroy();
                    return resolve({
                        errCode:0,
                        message:'xóa lịch khám hành công'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    addSchedule,
    getListSchedule,
    getScheduleOfDoctor,
    updateSchedule,
    getScheduleById,
    deleteSchedule
}