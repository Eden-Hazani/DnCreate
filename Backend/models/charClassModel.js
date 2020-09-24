const mongoose = require('mongoose');

const CharClassSchema = mongoose.Schema({

    name: {
        type: String,
    },
    description: {
        type: String,
    },
    backgroundColor: {
        type: String,
    },
    icon: {
        type: String,
    },
    brifInfo: {
        type: String,
    },
    armorProficiencies: {
        type: Array
    },
    weaponProficiencies: {
        type: Array
    },
    savingThrows: {
        type: Array
    },
    recommendation: {
        type: String,
    },
    information: {
        type: String,
    }

}, {
    versionKey: false
})




const CharClass = mongoose.model("CharClass", CharClassSchema, "charClasses");

module.exports = CharClass