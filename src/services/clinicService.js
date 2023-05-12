import db from "../models"

let postClinicInformation = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.nameClinic || !data.imgClinic || !data.descriptionHTML || !data.descriptionMarkdown || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'thieu tham so đcm'
                })
            }
            else {
                await db.Clinic.create({
                    name: data.nameClinic,
                    image: data.imgClinic,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    address: data.address
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Create clinic information success'
                })

            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();
            resolve({
                errCode: 0,
                data: data ? data : {},
                errMessage: "Get data success"
            })

        } catch (e) {
            reject(e);
        }
    })
}

let getDetailClinicByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.Clinic.findOne({
                    where: { id: id }
                })
                let dataTmp = {}
                if (data) {
                    dataTmp = await db.Doctor_Info.findAll({
                        where: { clinicId: id },
                        attributes: ['doctorId'],
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Get data success',
                    data: data ? data : {},
                    doctorsByClinic: dataTmp
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    postClinicInformation,
    getAllClinic,
    getDetailClinicByIdService
}