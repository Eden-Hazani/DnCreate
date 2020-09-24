const userLogic = require('../business-logic/user-logic');
const Character = require('../models/characterModel');


async function validateCharInSystem(request, response, next) {
    const char = new Character(JSON.parse(request.body.charInfo))
    const validation = await userLogic.validateChar(char.name, char.user_id);
    if (validation) {
        response.status(403).send('Character Already exists in system!')
        return;
    }
    next();
}

module.exports = validateCharInSystem;