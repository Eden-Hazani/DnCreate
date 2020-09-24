const crypto = require("crypto");

function hash(password) {
    return crypto.createHmac("sha512", config.salt).update(password).digest('hex');
}

module.exports = hash