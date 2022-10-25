const scheduleService = require('../service/ScheduleService')

let addSchedule = async (req,res) => {
    let resData= await scheduleService.addSchedule(req.body);
    if(resData.errCode == 2){
        return res.status(400).json(resData)
    } else if(resData.errCode == 3){
        return res.status(409).json(resData)
    } else {
        return res.status(200).json(resData)
    }
}

let getListSchedule = async (req,res) => {
    let resData = await scheduleService.getListSchedule(req.body)
    return res.status(200).json(resData)
}

let getListScheduleOfDoctor = async (req,res) =>{
    let resDate= await scheduleService.getScheduleOfDoctor(req.params,req.body)
    return res.status(200).json(resDate)
}

let updateSchedule = async (req,res) => {
    let resData = await scheduleService.updateSchedule(req.body,req.params)
    if(resData.errCode == 2){
        return res.status(400).json(resData)
    } else if(resData.errCode == 3){
        return res.status(409).json(resData)
    } else {
        return res.status(200).json(resData)
    }
}

let getScheduleBuId = async (req,res) => {
    let resData = await scheduleService.getScheduleById(req.params)
    if(resData.errCode == 1){
        return res.status(404).json(resData)
    } else{
        return res.status(200).json(resData)
    }
}

let deleteSchedule = async (req,res) =>{
    let resData = await scheduleService.deleteSchedule(req.params)
    if(resData.errCode == 1){
        return res.status(404).json(resData)
    }if(resData.errCode == 2){
        return res.status(400).json(resData)
    } else{
        return res.status(200).json(resData)
    }
}

module.exports = {
    addSchedule,
    getListSchedule,
    getListScheduleOfDoctor,
    updateSchedule,
    getScheduleBuId,
    deleteSchedule
}