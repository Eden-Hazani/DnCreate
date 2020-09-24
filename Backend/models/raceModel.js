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
    }

}, {
    versionKey: false
})




const Race = mongoose.model("Race", raceSchema, "races");

module.exports = Race