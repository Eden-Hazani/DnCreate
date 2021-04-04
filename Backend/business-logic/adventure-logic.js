const Adventure = require("../models/AdventureModel");
const Message = require("../models/MessageModel");
const User = require("../models/userModel");



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
    const info = await Adventure.findOneAndUpdate({ adventureIdentifier: adventure.adventureIdentifier }, adventure, { new: true, useFindAndModify: false }).populate('participants_id').exec();
    return info
}

function removeAdventure(adventureIdentifier) {
    Message.deleteMany({ adventureIdentifier: { $eq: adventureIdentifier } }).exec()
    return Adventure.deleteOne({ adventureIdentifier: { $eq: adventureIdentifier } }).exec()
}

async function getSingleLeadingAdventure(user_id, adventureIdentifier) {
    const adventure = Adventure.find({ leader_id: { $eq: user_id }, adventureIdentifier: { $eq: adventureIdentifier } }).populate('participants_id').exec();
    return adventure
}

async function getUsersProfilePicture(user_idArray) {
    let _idArray = [];
    let picArray = [];
    for (let _id of user_idArray) {
        _idArray.push(await User.findOne({ _id: _id.toString() }))
    }
    for (let item of _idArray) {
        picArray.push(item.profileImg)
    }
    return picArray
}

module.exports = {
    getParticipatingAdventures,
    createAdventure,
    getLeadingAdventures,
    updateAdventure,
    findAdventure,
    removeAdventure,
    getSingleLeadingAdventure,
    getUsersProfilePicture
}