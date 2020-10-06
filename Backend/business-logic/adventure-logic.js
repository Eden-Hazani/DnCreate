const Adventure = require("../models/AdventureModel");



function createAdventure(adventure) {
    return adventure.save();
}

async function getLeadingAdventures(user_id) {
    const adventures = Adventure.find({ leader_id: { $eq: user_id } }).populate('participants_id').exec();
    return adventures
}

function getParticipatingAdventures(character_id) {
    const adventures = Adventure.find({ participants_id: { $all: [character_id] } }).populate('participants_id').exec();
    return adventures
}


function findAdventure(adventureIdentifier) {
    const adventure = Adventure.find({ adventureIdentifier: { $eq: adventureIdentifier } });
    return adventure
}

async function updateAdventure(adventure) {
    const info = await Adventure.updateOne({ adventureIdentifier: adventure.adventureIdentifier }, adventure).exec();
    return info.n ? adventure : null;
}

function removeAdventure(adventureIdentifier) {
    return Adventure.deleteOne({ adventureIdentifier: { $eq: adventureIdentifier } }).exec()
}

module.exports = {
    getParticipatingAdventures,
    createAdventure,
    getLeadingAdventures,
    updateAdventure,
    findAdventure,
    removeAdventure
}