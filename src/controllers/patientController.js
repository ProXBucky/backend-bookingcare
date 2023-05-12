import patientService from "../services/patientService"

let postBookingAppointment = async (req, res) => {
    try {
        let respone = await patientService.postBookingAppointmentService(req.body)
        return res.status(200).json(respone)
    } catch (e) {
        console.log('error', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let postVerifyingEmail = async (req, res) => {
    try {
        let respone = await patientService.postVerifyingEmailService(req.body)
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
    postBookingAppointment: postBookingAppointment,
    postVerifyingEmail: postVerifyingEmail,
}