const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const hash = require("../utilities/hash")

function verifyIsAdmin(request, response, next) {
    if (!request.headers.authorization) {
        response.status(401).send("You are not logged in")
        return;
    }


    console.log(request.headers.authorization)
    const token = request.headers.authorization;
    if (!token) {
        response.status(401).send("You are not logged in")
    }
    jwt.verify(token, config.jwt.secretKey, (err, payload) => {
        console.log(payload)
        if (err) {
            if (err.message === 'jwt expired') {
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