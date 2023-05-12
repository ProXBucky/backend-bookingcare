import db from "../models";
import { postEmail } from "../services/gmailService"
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config()

let buildURLVerify = (doctorId, token) => {
    let result = process.env.REACT_URL + `/verify_appointment?doctorId=${doctorId}&token=${token} `
    return result
}

let postBookingAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check neu k co trong database moi create
            if (!data.email || !data.doctorId || !data.date || !data.timeType
                || !data.phoneNumber || !data.address
                || !data.gender || !data.reason || !data.firstName || !data.lastName
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                })
            } else {
                let token = uuidv4();
                // Tao tai khoan tu dong cho user
                let res = await db.User.findOrCreate({
                    where: { email: data.email },
                    attributes: { exclude: ['password'] },
                    defaults: {
                        email: data.email,
                        phonenumber: data.phoneNumber,
                        address: data.address,
                        gender: data.gender,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        roleId: 'R3'
                    }
                });
                // Neu da co tai khoan thi tao lich hen
                if (res && res[0]) {
                    let respone = await db.Booking.findOrCreate({
                        where: { patientId: res[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: res[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            reason: data.reason,
                            token: token
                        }
                    });
                    // console.log(buildURLVerify(data.doctorId, token))
                    await postEmail(res[0], respone[0].date, data.doctorName, data.timeAppoint, data.language, buildURLVerify(data.doctorId, token))
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Post success'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let postVerifyingEmailService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            }
            else {
                let patient = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                    }
                })
                if (patient) {
                    if (patient.statusId === 'S1') {
                        let values = {
                            statusId: 'S2'
                        };
                        let selector = {
                            where: {
                                doctorId: data.doctorId,
                                token: data.token,
                                statusId: 'S1'
                            }
                        };
                        await db.Booking.update(values, selector);
                        resolve({
                            errCode: 0,
                            errMessage: "Update appointment status success"
                        })
                    }
                    else if (patient.statusId === 'S2') {
                        resolve({
                            errCode: 3,
                            errMessage: 'Appointment was confimed'
                        })
                    }
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment is not exist'
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    postBookingAppointmentService: postBookingAppointmentService,
    postVerifyingEmailService: postVerifyingEmailService
}