const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const hash = require("../utilities/hash")

function verifyIsAdmin(request, response, next) {
    if (!request.headers.authorization) {
        response.status(401).send("You are not logged in")
        return;
    }


    const token = request.headers.authorization.split(" ")[1];
    if (!token) {
        response.status(401).send("You are not logged in")
    }
    jwt.verify(token, config.jwt.secretKey, (err, payload) => {
        if (err) {
            if (err.message === 'jwt expired') {
                console.log('has expired')
                response.status(403).send("Your Logging session has expired")
                return;
            }
            response.status(401).send("You are not logged in")
            return;
        }
        if (!payload.user.isAdmin) {
            response.status(403).send("Not an Admin")
            return;
        }
        response.locals = payload

        next();
    })
}

module.exports = verifyIsAdmin;