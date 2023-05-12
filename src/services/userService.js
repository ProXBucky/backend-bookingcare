import db from "../models/index"
import bcrypt from 'bcryptjs';
let salt = bcrypt.genSaltSync(10);

let handleLoginPage = (emailTemp, passwordTemp) => {
    let userData = {}
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await checkEmailExist(emailTemp);
            var attributes = ['email', 'password', 'roleId', 'firstName', 'lastName', 'id'];
            if (isExist) {
                let user = await db.User.findOne({
                    where: { email: emailTemp },
                    raw: "true",
                    attributes: attributes,
                })
                if (user) {
                    const comparePassword = bcrypt.compareSync(passwordTemp, user.password)
                    if (comparePassword) {
                        userData.errCode = 0;
                        userData.message = `This is OK`;
                        delete user.password;   // delete attribute password
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.message = `Password isn't wrong`;
                    }
                } else {
                    userData.errCode = 2;
                    userData.message = `User's not found`;
                }

            } else {
                userData.errCode = 1;
                userData.message = `Email's not exist, please type different email`;
            }
            resolve(userData)
            console.log(userData);
        }
        catch (e) {
            reject(e);
        }
    })
}

let checkEmailExist = (emailTemp) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userExist = await db.User.findOne({
                where: { email: emailTemp }
            })
            if (userExist) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let data = '';
        try {
            if (userId === 'ALL') {
                data = await db.User.findAll({
                    attributes: { exclude: ['password'] }
                })
            }
            if (userId && userId !== 'ALL') {
                data = await db.User.findOne({
                    attributes: { exclude: ['password'] },
                    where: { id: userId },
                    raw: "true"
                })
            }
            resolve(data);

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

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkExist = await checkEmailExist(data.email); //Check email da ton tai chua
            if (checkExist === true) {
                resolve({
                    errCode: 1,
                    errMessage: `Email is used, please type diffirent email`,
                })
            }
            else {
                let hashPassword = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    gender: data.gender,
                    roleId: data.roleId,
                    phonenumber: data.phonenumber,
                    positionId: data.positionId,
                    image: data.avatar,
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Create new user succeed'
            })
        } catch (e) {
            reject(e);
        }
    })
}

let editUser = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!user.id || !user.roleId || !user.positionId || !user.gender) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing value parameter',
                })
            }
            await db.User.update({
                firstName: user.firstName,
                lastName: user.lastName,
                phonenumber: user.phonenumber,
                address: user.address,
                gender: user.gender,
                roleId: user.roleId,
                positionId: user.positionId,
                image: user.avatar

            }, {
                where: {
                    id: user.id
                }
            })
            resolve({
                errCode: 0,
                errMessage: 'Update user succeed'
            });
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        //console.log(userId)
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: `User's not exist`
                })
            }
            let tmp = await db.User.findOne({ where: { id: userId } })
            // let tmp = await db.User.findOne({ where: { id: userId.id } })
            //console.log(tmp)
            if (!tmp) {
                resolve({
                    errCode: 2,
                    errMessage: `User's not found`
                })
            }
            await db.User.destroy({ where: { id: userId } })
            // await db.User.destroy({ where: { id: userId.id } })
            resolve({
                errCode: 0,
                errMessage: 'Delete succeed'
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getAllCodeService = (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!type) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing type parameter'
                });
            }
            else {
                let res = {};
                let data = await db.Allcode.findAll({ where: { type: type } });
                res.errCode = 0;
                res.data = data;
                resolve(res);
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleLoginPage: handleLoginPage,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    editUser: editUser,
    deleteUser: deleteUser,
    getAllCodeService: getAllCodeService,

}


