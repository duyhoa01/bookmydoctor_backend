const revenueService = require('../service/RevenueService')

let getRevenue =async (req,res) => {
    if(!req.query.begin){
        return res.status(400).json({
            errCode:"2",
            message: 'thiếu thời gian bắt đầu'
        })
    }
    if(!req.query.end){
        return res.status(400).json({
            errCode:"2",
            message: 'thiếu thời gian kết thúc'
        })
    }
    data = {
        begin: req.query.begin,
        end: req.query.end,
    }
    let resData = await revenueService.getRevenue(data);
    return res.status(200).json(resData);
}

let getRevenueOfSpecialty =async (req,res) => {
    if(!req.query.begin){
        return res.status(400).json({
            errCode:"2",
            message: 'thiếu thời gian bắt đầu'
        })
    }
    if(!req.query.end){
        return res.status(400).json({
            errCode:"2",
            message: 'thiếu thời gian kết thúc'
        })
    }
    data = {
        begin: req.query.begin,
        end: req.query.end,
    }
    let resData = await revenueService.getRevenueOfSpecialty(data);
    return res.status(200).json(resData);
}

module.exports = {
    getRevenue,
    getRevenueOfSpecialty
}