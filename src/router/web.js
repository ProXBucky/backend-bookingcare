import express from "express"
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController"
import patientController from "../controllers/patientController"
import specialtyController from "../controllers/specialtyController"
import clinicController from "../controllers/clinicController"

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.editCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUser);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcodes', userController.getAllCode);

    router.get('/api/get-top-doctor', doctorController.getTopDoctor)
    router.get('/api/get-all-doctor', doctorController.getAllDoctor)
    router.post('/api/post-info-doctor', doctorController.postInfoDoctor)
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById)
    router.post('/api/bulk-create-schedule', doctorController.createBulkSchedule)
    router.get('/api/get-schedule-doctor-by-doctorid-and-date', doctorController.getScheduleByDoctorIdAndDate)
    router.get('/api/get-doctor-info-by-id', doctorController.getDoctorInfoById)
    router.get('/api/get-extra-info-doctor-by-id', doctorController.getExtraInfoById)
    router.get('/api/get-list-patient-by-day', doctorController.getListPatientByDay)
    router.post('/api/post-the-prescription', doctorController.postThePrescription)


    router.post('/api/post-booking-appointment', patientController.postBookingAppointment)
    router.post('/api/post-verifying-email', patientController.postVerifyingEmail)

    router.post('/api/post-specialty-information', specialtyController.postSpecialtyInformation)
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty)
    router.get('/api/get-detail-specialty-by-id-and-doctor-by-location', specialtyController.getDetailSpecialtyByIdAndDoctorByLocation)

    router.post('/api/post-clinic-information', clinicController.postClinicInformation)
    router.get('/api/get-all-clinic', clinicController.getAllClinic)
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById)






    return app.use("/", router);
}

module.exports = initWebRoutes;