const User = require("../models/userModel");
const authLogic = require("../business-logic/auth-logic");
const jwt = require('jsonwebtoken');



async function validateUserInSystem(request, response, next) {
    const newUser = new User(JSON.parse(request.body.userInfo))
    const validation = await authLogic.validateRegister(newUser.username);
    if (validation) {
        response.status(403).send({ message: "User Already In system" });
        return;
    }
    next();
}

module.exports = validateUserInSystem;