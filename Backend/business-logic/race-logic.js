const Race = require("../models/raceModel");
const mongoose = require('mongoose');

function getAllRaces(start, end, _id, raceType) {
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
    // return Race.find().skip(parseInt(start)).limit(parseInt(end)).exec()
}

function searchRaces(text, raceType, _id) {
    console.log(raceType === 'null')
    if (raceType === 'true') {
        return Race.find({
            $or: [{ user_id: mongoose.Types.ObjectId(_id) }, { visibleToEveryone: true }, { visibleToEveryone: { $exists: false } }],
            name: { $regex: text, $options: "i" }
        }).exec();
    }
    if (raceType === 'null' || raceType === 'false') {
        console.log('fggggg')
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

function getPrimeRaces() {
    return Race.find().skip(0).limit(20).exec();
}

module.exports = {
    getAllRaces,
    searchRaces,
    createRace,
    getPrimeRaces
}