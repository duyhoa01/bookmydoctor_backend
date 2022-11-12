const { Op, where, TIME } = require('sequelize');
const e = require('express');
const db= require('../models');

let addSchedule = async (data) =>{
    return new Promise(async(resolve, reject) => {
        try {
            data.begin= new Date(data.begin)
            data.end =  new Date(data.end)
            beginCop= Date.parse(data.begin)
            endCop= Date.parse(data.end)
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

            let d=(endCop- beginCop)/data.maxnumber

            if(d<20*60000){
                return resolve({
                    errCode:2,
                    message:'thời gian cho mỗi lịch khám phải tối thiểu 20 phút'
                })
            }

            let arr =[]
            let begin = beginCop
            let end = beginCop+d
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
                || (s.begin.getTime()===data.begin.getTime() && s.end.getTime()===data.end.getTime())){
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

let getListSchedule = async (data,pageNumber, size) => {
    return new Promise(async(resolve, reject) => {
        try {
            pageNumber = pageNumber-0;
            size = size -0;
            let resData = {}
            if(data.startDate && data.endDate){
                const {count, rows} = await db.Schedule.findAndCountAll({
                    include:{
                        model: db.Doctor,
                        require: true,
                        as: 'doctor'
                    },
                    order: [
                        ['begin', 'ASC']
                    ],
                    offset: pageNumber*size,
                    limit: size,
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
                resData.schedules= rows;
                resData.totalElements=count;
                resData.totalPages= Math.ceil(count/size);
            } else{
                const {count, rows} = await db.Schedule.findAndCountAll({
                    offset: pageNumber*size,
                    limit: size,
                    order: [
                        ['begin', 'ASC']
                    ],
                    include:{
                        model: db.Doctor,
                        require: true,
                        as: 'doctor'
                    }
                });
                resData.schedules= rows;
                resData.totalElements=count;
                resData.totalPages= Math.ceil(count/size);
            }
            resData.size=size;
            resData.page = pageNumber;
            return resolve(resData)
        } catch (e) {
            reject(e)
        }
    })
}

let getScheduleOfDoctor = async (params,data,pageNumber, size) => {
    return new Promise(async(resolve, reject) => {
        try {
            pageNumber = pageNumber-0;
            size = size -0;
            let resData = {}
            if(data.startDate && data.endDate){
                const {count, rows} = await db.Schedule.findAndCountAll({
                    order: [
                        ['begin', 'ASC']
                    ],
                    offset: pageNumber*size,
                    limit: size,
                    where:{
                        [Op.and]:[{
                            begin: {
                                [Op.between]: [data.startDate, data.endDate]
                            },
                            end: {
                                [Op.between]: [data.startDate, data.endDate]
                            }
                        }
                        ],
                        doctor_id: params.id
                    }
                });
                resData.schedules= rows;
                resData.totalElements=count;
                resData.totalPages= Math.ceil(count/size);
            }else{
                const {count, rows} = await db.Schedule.findAndCountAll({
                    order: [
                        ['begin', 'ASC']
                    ],
                    offset: pageNumber*size,
                    limit: size,
                    where:{
                        doctor_id: params.id
                    }
                });
                resData.schedules= rows;
                resData.totalElements=count;
                resData.totalPages= Math.ceil(count/size);
            }
            resData.size=size;
            resData.page = pageNumber;
            return resolve(resData)
        } catch (e) {
            reject(e)
        }
    })
}

let updateSchedule = async (data,param) =>{
    return new Promise(async(resolve, reject) => {
        try {

            let d=(Date.parse(data.end)- Date.parse(data.begin))

            if(d<20*60000){
                return resolve({
                    errCode:2,
                    message:'thời gian cho mỗi lịch khám phải tối thiểu 20 phút'
                })
            }
            data.begin= new Date(data.begin)
            data.end =  new Date(data.end)

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
                        as: 'doctor',
                        include: {
                            model: db.User,
                            require: true,
                            as: 'user',
                        }
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
                if(schedule.status == true){
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

let addScheduleMultiDate =  async (data)=>{
    return new Promise(async(resolve, reject) => {
        try{
            var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

            data.beginDate= Date.parse(data.beginDate)
            data.endDate = Date.parse(data.endDate)
            // console.log(new Date('2022/10/10 07:00:00 GMT+0700'))
            if(data.endDate<=data.beginDate){
                return resolve({
                    errCode: 2,
                    message:'ngày bắt đầu phải trước ngày kết thúc'
                })
            }
            let numberDate = (data.endDate - data.beginDate)/(60000*60*24);
            let arr = []
            let k = 0;
            for(let i =0 ; i<= numberDate ; i++){
                let date = data.beginDate + i*(60000*60*24);
                let d= new Date(date);
                let  weekday =days[(d).getDay()]
                if(data.weekdays.includes(weekday)){
                    let schedules = data.schedules
                    for(let s of schedules){
                        let list = s.split('-')
                        // let timesBegin = list[0].split(':');
                        // let timesEnd = list[1].split(':');
                        // let begin= new Date(date);
                        // begin = new Date(begin.getTime()+ 60000*60*timesBegin[0]+ 60000* timesBegin[1])
                        // let end = new Date(date)
                        // end = new Date(end.getTime()+ 60000*60*timesEnd[0]+ 60000* timesEnd[1])
                        // console.log(d.getFullYear() +'/'+ (d.getMonth()+1)+'/'+d.getDate()+' '+list[0])
                        begin = new Date(d.getFullYear() +'/'+ (d.getMonth()+1)+'/'+d.getDate()+' '+list[0])
                        end = new Date(d.getFullYear() +'/'+ (d.getMonth()+1)+'/'+d.getDate()+' '+list[1])
                        // console.log(begin);
                        // console.log(end)
                        let input = {
                            begin: begin,
                            end: end,
                            doctor_id: data.doctor_id
                        }
                        if(await checkOverlapDateOfCreateSchedule(input,0)==false){
                            const schedule = await db.Schedule.create({
                                begin:begin,
                                end:end,
                                doctor_id: data.doctor_id,
                                cost:data.cost,
                                status:false
                            })
                            arr[k]=schedule;
                            k++;
                        }
                    }
                }
            }
            return resolve({
                errCode:0,
                message: arr
            })
        } catch(e){
            reject(e)
        }
    });
}

module.exports = {
    addSchedule,
    getListSchedule,
    getScheduleOfDoctor,
    updateSchedule,
    getScheduleById,
    deleteSchedule,
    addScheduleMultiDate
}