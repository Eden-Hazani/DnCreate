const Race = require("../models/raceModel");

function getAllRaces() {
    return Race.find().exec();
}

function searchRaces(text) {
    return Race.find({ name: { $regex: text, $options: "i" } }).exec();
}

function createRace(race) {
    return race.save();
}

module.exports = {
    getAllRaces,
    searchRaces,
    createRace
}