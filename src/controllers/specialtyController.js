import specialtyService from "../services/specialtyService"

let postSpecialtyInformation = async (req, res) => {
    try {
        let respone = await specialtyService.postSpecialtyInformationService(req.body)
        return res.status(200).json(respone)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllSpecialty = async (req, res) => {
    try {
        let respone = await specialtyService.getAllSpecialty();
        return res.status(200).json(respone)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let getDetailSpecialtyByIdAndDoctorByLocation = async (req, res) => {
    try {
        let respone = await specialtyService.getDetailSpecialtyByIdAndDoctorByLocation(req.query.id, req.query.location);
        return res.status(200).json(respone)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

module.exports = {
    postSpecialtyInformation,
    getAllSpecialty,
    getDetailSpecialtyByIdAndDoctorByLocation,
}