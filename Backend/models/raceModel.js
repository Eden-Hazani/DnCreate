const mongoose = require('mongoose');

const raceSchema = mongoose.Schema({

    name: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    abilityBonus: {
        type: Object
    },
    raceColor: {
        type: String
    },
    raceAbilities: {
        age: { type: String },
        alignment: { type: String },
        size: { type: String },
        speed: { type: Number },
        languages: { type: String },
        uniqueAbilities: { type: Array }
    }

}, {
    versionKey: false
})




const Race = mongoose.model("Race", raceSchema, "races");

module.exports = Race