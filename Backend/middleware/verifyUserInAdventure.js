const userLogic = require("../business-logic/user-logic");
const adventureLogic = require("../business-logic/adventure-logic");



async function verifyUserInAdventure(request, response, next) {
    const newAdventure = JSON.parse(request.body.adventure)
    const currentAdventure = await adventureLogic.findAdventure(newAdventure.adventureIdentifier)
    if (response.locals.user._id === currentAdventure[0].leader_id) {
        response.status(403).send("You are the DM of this adventure, you cannot join it as a player");
        return;
    }
    let chars = null
    for (let participant of currentAdventure[0].participants_id) {
        chars = await userLogic.getCharForAdventure(participant);
        console.log(chars)
        if (response.locals.user._id === chars.user_id._id.toString()) {
            response.status(403).send("User Is already part of this adventure!");
            return;
        }
    }
    next();
}

module.exports = verifyUserInAdventure;