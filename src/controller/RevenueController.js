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
let getStatisticalInfo = async(req, res) => {
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
    let pageNumber = req.query.page === undefined ? 0: req.query.page
    let size = req.query.size === undefined ? 10 : req.query.size
    data = {
        begin: req.query.begin,
        end: req.query.end,
        pageNumber:pageNumber,
        size:size
    }
    let resData = await revenueService.getStatisticalInfo(data);
    let page ={}
    page.size= resData.size
    page.totalPages= resData.totalPages
    page.totalElements = resData.totalElements
    page.page = resData.page
    return res.status(200).json({
        erroCode:0,
        message: 'OK',
        page: page,
        statistics: resData.statistics,
        data: resData.data
    })
}
module.exports = {
    getRevenue,
    getRevenueOfSpecialty,
    getStatisticalInfo
}