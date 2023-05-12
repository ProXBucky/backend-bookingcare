import db from "../models"

let postSpecialtyInformationService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.nameSpecialty || !data.imgSpecialty || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            }
            else {
                await db.Specialty.create({
                    name: data.nameSpecialty,
                    image: data.imgSpecialty,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Create specialty information success'
                })

            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
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

let getDetailSpecialtyByIdAndDoctorByLocation = (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let dataTmp = {};
                let data = await db.Specialty.findOne({
                    where: { id: id },
                    attributes: { include: ['name', 'id', 'descriptionHTML'] },
                })
                if (data) {
                    if (location === 'ALL') {
                        dataTmp = await db.Doctor_Info.findAll({
                            where: { specialtyId: id },
                            attributes: ['doctorId'],
                        })
                    } else {
                        dataTmp = await db.Doctor_Info.findAll({
                            where: { specialtyId: id, provinceId: location },
                            attributes: ['doctorId'],
                        })
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: "Get data success",
                    data: data ? data : {},
                    doctorsBySpecialty: dataTmp
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    postSpecialtyInformationService,
    getAllSpecialty,
    getDetailSpecialtyByIdAndDoctorByLocation,
}