
import doctorService from "../services/doctorService"
let getTopDoctor = async (req, res) => {
    try {
        let limit = req.query.limit
        let response = await doctorService.getTopDoctorService(+limit)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        })
    }

}

let getAllDoctor = async (req, res) => {
    try {
        let response = await doctorService.getAllDoctorService()
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let postInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.postInfoDoctorService(req.body);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let response = await doctorService.getDetailDoctor(req.query.id);
        return res.status(200).json(response)

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let createBulkSchedule = async (req, res) => {
    try {
        let response = await doctorService.createBulkScheduleService(req.body)
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getScheduleByDoctorIdAndDate = async (req, res) => {
    try {
        let response = await doctorService.getScheduleByDoctorIdAndDateService(req.query.id, req.query.date)
        return res.status(200).json(response)
    } catch (e) {
        console.log('error', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'ERROR FROM SERVER'
        })
    }
}

let getDoctorInfoById = async (req, res) => {
    try {
        let respone = await doctorService.getDetailDoctorByIdService(req.query.doctorId)
        return res.status(200).json(respone)

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getExtraInfoById = async (req, res) => {
    try {
        let respone = await doctorService.getExtraInfoByIdService(req.query.doctorId)
        return res.status(200).json(respone)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getListPatientByDay = async (req, res) => {
    try {
        let respone = await doctorService.getListPatientByDayService(req.query.id, req.query.date)
        return res.status(200).json(respone)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let postThePrescription = async (req, res) => {
    try {
        let respone = await doctorService.postThePrescription(req.body)
        return res.status(200).json(respone)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}


module.exports = {
    getTopDoctor,
    getAllDoctor,
    postInfoDoctor,
    getDetailDoctorById,
    createBulkSchedule,
    getScheduleByDoctorIdAndDate,
    getDoctorInfoById,
    getExtraInfoById,
    getListPatientByDay,
    postThePrescription
}