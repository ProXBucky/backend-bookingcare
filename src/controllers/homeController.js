
import db from "../models/index"
import CRUDservices from "../services/CRUDservices"

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll()
        return res.render('homePage.ejs', {
            data: JSON.stringify(data)
        })

    } catch (e) {
        console.log(e);
    }
}

let getAboutPage = (req, res) => {
    return res.render('aboutPage.ejs')
}

let getCRUD = (req, res) => {
    return res.render('getCRUDPage.ejs')
}

let postCRUD = async (req, res) => {
    await CRUDservices.createNewUser(req.body);
    return res.send('Post succeed')
}

let displayGetCRUD = async (req, res) => {
    try {
        let data = await CRUDservices.displayAllUsers();
        return res.render('displayCRUD.ejs', { dataUser: data })
    } catch (e) {
        console.log(e);
    }

}

let editCRUD = async (req, res) => {
    let idUser = req.query.id;
    if (idUser) {
        let user = await CRUDservices.getUserInfoById(idUser);
        return res.render('editCRUD.ejs', { dataUser: user })
    }
    else {
        return res.send('User is not found')
    }

}

let putCRUD = async (req, res) => {
    let inforUser = req.body;
    try {
        let data = await CRUDservices.editUserByInfor(inforUser);
        return res.render('displayCRUD.ejs', { dataUser: data })

    } catch (e) {
        console.log(e);
    }
}

let deleteCRUD = async (req, res) => {
    let idUser = req.query.id
    if (idUser) {
        await CRUDservices.deleteUserById(idUser);
        return res.send('Delete succeed')
    }
    return res.send('No found')
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    editCRUD: editCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}