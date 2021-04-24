const User = require("../models/userModel");
const authLogic = require("../business-logic/auth-logic");
const jwt = require('jsonwebtoken');



async function validateExistingAlias(request, response, next) {
    const alias = request.body.alias
    const validation = await authLogic.validateExistingAlias(alias);
    if (validation) {
        response.status(403).send({ message: "Alias already exists" });
        return;
    }
    next();
}

module.exports = validateExistingAlias;