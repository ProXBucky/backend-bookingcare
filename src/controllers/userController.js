import userService from "../services/userService"

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Not enough peremeter',
        })
    }
    else {
        let userData = await userService.handleLoginPage(email, password);
        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.message,
            user: userData.user ? userData.user : {}
        })

    }
}

let handleGetAllUser = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'ERROR',
            user: []
        })
    }
    if (id) {
        let data = await userService.getAllUser(id)
        return res.status(200).json({
            errCode: 0,
            errMessage: 'SUCCEED',
            user: data
        })

    }
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message)
}

let handleEditUser = async (req, res) => {
    let message = await userService.editUser(req.body)
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    let message = await userService.deleteUser(req.body.id)
    return res.status(200).json(message)

}

let getAllCode = async (req, res) => {
    try {
        // setTimeout(async () => {
        // }, 2000)
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'ERROR FROM SERVER',
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUser: handleGetAllUser,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,



}