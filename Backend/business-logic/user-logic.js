const c = require("config");
const Character = require("../models/characterModel");



function addCharacter(character) {
    return character.save();
}
function getCharacters(user_id) {
    return Character.find({ user_id: { $eq: user_id } });
}

function removeCharacter(char_id) {
    return Character.deleteOne({ _id: { $eq: char_id } }).exec()
}

function validateChar(char, _id) {
    return Character.findOne({ name: { $eq: char }, user_id: { $eq: _id } });
}

async function updateCharacter(character) {
    const info = await Character.updateOne({ _id: character._id }, character).exec();
    return info.n ? character : null;
}


module.exports = {
    addCharacter,
    getCharacters,
    removeCharacter,
    updateCharacter,
    validateChar,
}