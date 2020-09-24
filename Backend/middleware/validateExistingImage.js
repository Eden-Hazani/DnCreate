const User = require("../models/userModel");
const authLogic = require("../business-logic/auth-logic");
const jwt = require('jsonwebtoken');
const fs = require('fs');



async function validateExistingImage(request, response, next) {
    const newUser = new User(response.locals.user)
    const validation = await authLogic.validateRegister(newUser.username);
    if (validation.profileImg) {
        fs.unlink(`./public/uploads/profile-imgs/${validation.profileImg}`, function (err) {
            if (err) return console.log(err);
            console.log('file deleted successfully');
        });
    }
    next();
}

module.exports = validateExistingImage;