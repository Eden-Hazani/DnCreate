const Race = require("../models/raceModel");
const mongoose = require('mongoose');

function getAllRaces(start, end, _id, raceType) {
    if (_id === 'noUserId') {
        return Race.find({
            user_id: { $exists: false },
        }).skip(parseInt(start)).limit(parseInt(end)).exec();
    }
    if (raceType === 'true') {
        return Race.find({
            $or: [{ user_id: mongoose.Types.ObjectId(_id) }, { visibleToEveryone: true }, { visibleToEveryone: { $exists: false } }],
        }).skip(parseInt(start)).limit(parseInt(end)).exec();
    }
    if (raceType === 'null' || raceType === 'false') {
        return Race.find({
            $or: [{ visibleToEveryone: { $eq: false } }, { visibleToEveryone: { $exists: false } }],
            $or: [{ user_id: { $eq: mongoose.Types.ObjectId(_id) } }, { user_id: { $exists: false } }],
        }).skip(parseInt(start)).limit(parseInt(end)).exec();
    }
}

function getUserCreatedRaces(_id) {
    return Race.find({ user_id: { $eq: mongoose.Types.ObjectId(_id) } }).exec();
}

async function updateCustomRace(race) {
    const info = await Race.findOneAndUpdate({ user_id: race.user_id }, race,
        { new: true, useFindAndModify: false }).exec();
    return info
}


function searchRaces(text, raceType, _id) {
    if (_id === 'noUserId') {
        return Race.find({
            user_id: { $exists: false },
            name: { $regex: text, $options: "i" }
        }).exec();
    }
    if (raceType === 'true') {
        return Race.find({
            $or: [{ user_id: mongoose.Types.ObjectId(_id) }, { visibleToEveryone: true }, { visibleToEveryone: { $exists: false } }],
            name: { $regex: text, $options: "i" }
        }).exec();
    }
    if (raceType === 'null' || raceType === 'false') {
        return Race.find({
            $or: [{ visibleToEveryone: { $eq: false } }, { visibleToEveryone: { $exists: false } }],
            $or: [{ user_id: { $eq: mongoose.Types.ObjectId(_id) } }, { user_id: { $exists: false } }],
            name: { $regex: text, $options: "i" }
        }).exec();
    }
}

function createRace(race) {
    return race.save();
}

function getRace(_id) {
    return Race.findOne({ _id: { $eq: _id } }).exec()
}

function getPrimeRaces() {
    return Race.find().skip(0).limit(20).exec();
}

module.exports = {
    getRace,
    getAllRaces,
    searchRaces,
    createRace,
    getPrimeRaces,
    getUserCreatedRaces,
    updateCustomRace
}