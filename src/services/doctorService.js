import db from "../models";
require('dotenv').config()
// import differenceBy from 'lodash/differenceBy'
import { postEmailPrescription } from "../services/gmailService"
import _ from 'lodash'


let getTopDoctorService = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!limit) { limit = 10 }
            let data = await db.User.findAll({
                limit: limit,
                attributes: { exclude: ['password'] },
                order: [['createdAt', 'DESC']],
                where: { roleId: 'R2' },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: 'true',
                nest: 'true', //Chuyển data từ Allcode theo object
            })
            resolve({
                errCode: 0,
                data: data
            });
        } catch (e) {
            reject(e);
        }
    })
}

let getAllDoctorService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: { exclude: ['password', 'image'] },
                order: [['createdAt', 'DESC']],
            })
            resolve({
                errCode: 0,
                data: data,
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
}

// let validateInput = (input) => {
//     let check = true;
//     let missingPara = ''
//     let arr = ['doctorId', 'contentHTML', 'contentMarkdown', 'description', 'action', 'price', 'payment', 'province', 'clinicName', 'clinicAddress', 'note', 'specialty', 'clinic']
//     for (let i = 0; i < arr.length; i++) {
//         if (!input.arr[i]) {
//             missingPara = arr[i];
//             check = false;
//             break;
//         }
//     }
//     return check, missingPara
// }

// if (validateInput(doctor).check === false) {
//     resolve({
//         errCode: 1,
//         errMessage: `Missing parameter: ${validateInput(doctor).missingPara}`
//     })
let postInfoDoctorService = (doctor) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctor.doctorId || !doctor.contentHTML || !doctor.contentMarkdown || !doctor.description || !doctor.action
                || !doctor.price || !doctor.payment || !doctor.province || !doctor.clinicName || !doctor.clinicAddress
                || !doctor.note || !doctor.specialty || !doctor.clinic
            )
            // || !doctor.clinic
            {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                // console.log('check input: ', doctor)
                if (doctor.action === 'CREATE') {
                    await db.Markdown.create({
                        doctorId: doctor.doctorId,
                        contentHTML: doctor.contentHTML,
                        contentMarkdown: doctor.contentMarkdown,
                        description: doctor.description,
                    })
                }
                else if (doctor.action === 'EDIT') {
                    await db.Markdown.update(
                        {
                            doctorId: doctor.doctorId,
                            contentHTML: doctor.contentHTML,
                            contentMarkdown: doctor.contentMarkdown,
                            description: doctor.description,
                        },
                        { where: { doctorId: doctor.doctorId } }
                    )
                }

                let doctorSelect = await db.Doctor_Info.findOne({
                    where: { doctorId: doctor.doctorId },
                    raw: 'true'
                })
                // console.log('check doctorSelected: ', doctorSelect)
                if (doctorSelect) {
                    await db.Doctor_Info.update({
                        doctorId: doctor.doctorId,
                        priceId: doctor.price.value,
                        paymentId: doctor.payment.value,
                        provinceId: doctor.province.value,
                        nameClinic: doctor.clinicName,
                        addressClinic: doctor.clinicAddress,
                        note: doctor.note,
                        specialtyId: doctor.specialty,
                        clinicId: doctor.clinic
                    },
                        { where: { doctorId: doctorSelect.doctorId } }
                    )
                } else {
                    await db.Doctor_Info.create({
                        doctorId: doctor.doctorId,
                        priceId: doctor.price.value,
                        paymentId: doctor.payment.value,
                        provinceId: doctor.province.value,
                        nameClinic: doctor.clinicName,
                        addressClinic: doctor.clinicAddress,
                        note: doctor.note,
                        specialtyId: doctor.specialty,
                        clinicId: doctor.clinic
                    })
                }
            }
            resolve({
                errCode: 0,
                errMessage: "Add information doctor success"
            })
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
}

let getDetailDoctor = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.User.findOne({
                    attributes: { exclude: ['password'] },
                    where: { id: id },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Info, attributes: ['provinceId', 'paymentId', 'priceId', 'addressClinic', 'nameClinic', 'note', 'count', 'specialtyId', 'clinicId'],
                            include: [
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi', 'keyMap'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi', 'keyMap'] },
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi', 'keyMap'] },
                            ]
                        }
                    ],
                    raw: 'true',
                    nest: 'true',
                })
                if (data) {
                    let imageBase64 = ''
                    if (data.image) {
                        imageBase64 = Buffer.from(data.image, 'base64').toString('Binary');    //decode image avatar from buffer to base64
                    }
                    data.image = imageBase64
                }
                resolve({
                    errCode: 0,
                    data: data
                })

            }
        } catch (e) {
            reject(e);
        }
    })
}

let createBulkScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule.map(item => {
                        item.maxNumber = process.env.MAX_PATIENT_PICK;
                        return item
                    })
                }
                let scheduleFromDatabase = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId },
                    attributes: ['date', 'maxNumber', 'doctorId', 'timeType'],
                    raw: true
                })

                //Check trùng lịch
                let myDifferences = _.differenceWith(schedule, scheduleFromDatabase, (a, b) => {
                    return a.timeType === b.timeType && a.date === b.date
                })
                //console.log("checkkkkkkkkkkkkkkkk", myDifferences)
                await db.Schedule.bulkCreate(myDifferences)
                resolve({
                    errCode: 0,
                    errMessage: 'OKE'
                });

            }

        } catch (e) {
            reject(e);
        }
    })
}

let getScheduleByDoctorIdAndDateService = (id, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            else {
                let data = await db.Schedule.findAll({
                    where: { doctorId: id, date: date },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                    ]
                    , raw: true, nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailDoctorByIdService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Doctor_Info.findOne({
                    where: { doctorId: doctorId },
                    attributes: { exclude: ['id', 'doctorId'] },
                    include: [
                        { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: 'true',
                    nest: 'true',
                })
                resolve({
                    errCode: 0,
                    data: data
                })

            }
        } catch (e) {
            reject(e);
        }
    })
}

let getExtraInfoByIdService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.User.findOne({
                    attributes: { exclude: ['password'] },
                    where: { id: doctorId },
                    include: [
                        { model: db.Markdown, attributes: ['description'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Info, attributes: ['provinceId', 'paymentId', 'priceId', 'count'],
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi', 'keyMap'] },
                            ]
                        }
                    ],
                    raw: 'true',
                    nest: 'true',
                })
                if (data) {
                    let imageBase64 = ''
                    if (data.image) {
                        imageBase64 = Buffer.from(data.image, 'base64').toString('Binary');    //decode image avatar from buffer to base64
                    }
                    data.image = imageBase64
                }
                resolve({
                    errCode: 0,
                    data: data
                })

            }
        } catch (e) {
            reject(e);
        }
    })
}

let getListPatientByDayService = (id, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: { doctorId: id, date: date, statusId: 'S2' },    //find all patient booked and confirmed
                    include: [
                        {
                            model: db.User, as: 'patientData', attributes: ['firstName', 'lastName', 'address', 'gender', 'phoneNumber', 'email'],
                            include: [
                                {
                                    model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']
                                },
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeData2', attributes: ['valueEn', 'valueVi'],
                        }
                    ],
                    raw: 'true',
                    nest: 'true',
                })
                resolve({
                    errCode: 0,
                    data: data ? data : {}
                })

            }
        } catch (e) {
            reject(e);
        }
    })
}

let postThePrescription = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check neu k co trong database moi create
            if (!data.email || !data.doctorId || !data.patientId || !data.filePrescription || !data.date || !data.timeType || !data.language) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                })
            } else {

                //update statusId S3
                let values = {
                    statusId: 'S3'
                };
                let selector = {
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        date: data.date,
                        timeType: data.timeType,
                        statusId: 'S2'
                    }
                };
                await db.Booking.update(values, selector);


                // Create history for patient
                await db.History.create({
                    patientId: data.patientId,
                    doctorId: data.doctorId,
                    files: data.filePrescription
                })

                await postEmailPrescription(data.email, data.date, data.language, data.filePrescription)
                resolve({
                    errCode: 0,
                    errMessage: 'Exam done'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    getTopDoctorService: getTopDoctorService,
    getAllDoctorService: getAllDoctorService,
    postInfoDoctorService: postInfoDoctorService,
    getDetailDoctor: getDetailDoctor,
    createBulkScheduleService: createBulkScheduleService,
    getScheduleByDoctorIdAndDateService: getScheduleByDoctorIdAndDateService,
    getDetailDoctorByIdService: getDetailDoctorByIdService,
    getExtraInfoByIdService: getExtraInfoByIdService,
    getListPatientByDayService,
    postThePrescription
}