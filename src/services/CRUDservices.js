import db from '../models/index';
import bcrypt from 'bcryptjs';
let salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender === 1 ? true : false,
                roleId: data.roleId,
                phonenumber: data.phonenumber,
                positionId: data.positionId,
            })

            resolve()
        } catch (e) {
            reject(e);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            let hash = bcrypt.hashSync(password, salt);
            resolve(hash);
        } catch (e) {
            reject(e);
        }
    })
}

let displayAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findAll({
                raw: true,
            });
            resolve(data);
        } catch (e) {
            reject(e);
        }
    })
}

let getUserInfoById = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findOne({ where: { id: idUser }, raw: "true" })
            if (data) {
                resolve(data);
            }
            else {
                resolve({})
            }
        } catch (e) {
            reject(e);
        }
    })
}

let editUserByInfor = (inforUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.User.update({ firstName: inforUser.firstName, lastName: inforUser.lastName, address: inforUser.address }, {
                where: {
                    id: inforUser.id
                }
            })
            let listUserUpdated = await db.User.findAll({ raw: "true" })
            resolve(listUserUpdated);
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUserById = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: idUser }
            })
            await user.destroy();
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    createNewUser: createNewUser,
    displayAllUsers: displayAllUsers,
    getUserInfoById: getUserInfoById,
    editUserByInfor: editUserByInfor,
    deleteUserById: deleteUserById,
}