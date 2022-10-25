const scheduleService = require('../service/ScheduleService')

let addSchedule = async (req,res) => {
    if (!req.body.begin || !req.body.end || !req.body.cost || !req.body.maxnumber || !req.body.doctor_id) {
        return res.status(400).json({
            erroCode:1,
            message:'nhap day du thong tin'
        })
    }
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
    let pageNumber = req.query.page === undefined ? 0: req.query.page
    let size = req.query.size === undefined ? 10 : req.query.size
    let resData = await scheduleService.getListSchedule(req.body,pageNumber,size)
    let page ={}
    page.size= resData.size
    page.totalPages= resData.totalPages
    page.totalElements = resData.totalElements
    page.page = resData.page
    return res.status(200).json({
        erroCode:0,
        message: 'OK',
        schedules: resData.schedules,
        page: page
    })
}

let getListScheduleOfDoctor = async (req,res) =>{
    let pageNumber = req.query.page === undefined ? 0: req.query.page
    let size = req.query.size === undefined ? 10 : req.query.size
    let resData= await scheduleService.getScheduleOfDoctor(req.params,req.body,pageNumber,size)
    let page ={}
    page.size= resData.size
    page.totalPages= resData.totalPages
    page.totalElements = resData.totalElements
    page.page = resData.page
    return res.status(200).json({
        erroCode:0,
        message: 'OK',
        schedules: resData.schedules,
        page: page
    })
}

let updateSchedule = async (req,res) => {
    if (!req.body.begin || !req.body.end || !req.body.cost) {
        return res.status(400).json({
            erroCode:1,
            message:'nhap day du thong tin'
        })
    }
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