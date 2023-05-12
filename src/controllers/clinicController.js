import { assign } from "nodemailer/lib/shared";
import clinicService from "../services/clinicService"

let postClinicInformation = async (req, res) => {
    try {
        let respone = await clinicService.postClinicInformation(req.body)
        return res.status(200).json(respone)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Missing parameter'
        })
    }
}

let getAllClinic = async (req, res) => {
    try {
        let respone = await clinicService.getAllClinic();
        return res.status(200).json(respone)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let getDetailClinicById = async (req, res) => {
    try {
        let respone = await clinicService.getDetailClinicByIdService(req.query.id)
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
    postClinicInformation,
    getAllClinic,
    getDetailClinicById
} 