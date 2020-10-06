const adventureLogic = require("../business-logic/adventure-logic");
const jwt = require('jsonwebtoken');
const Adventure = require("../models/AdventureModel");



async function validateUserIsLeader(request, response, next) {
    const adventureIdentifier = request.params.adventureIdentifier
    const user_id = request.params.leader_id;
    const adventureInSystem = await adventureLogic.findAdventure(adventureIdentifier);
    if (user_id !== adventureInSystem[0].leader_id) {
        response.status(403).send({ message: "Not The Adventure Leader" });
        return;
    }
    next();
}

module.exports = validateUserIsLeader;