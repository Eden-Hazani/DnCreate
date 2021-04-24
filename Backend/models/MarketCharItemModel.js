const mongoose = require('mongoose');

const MarketCharItemSchema = mongoose.Schema({

    currentLevelChar: {
        type: Object,
    },
    characterLevelList: {
        type: Array,
    },
    creator_id: {
        type: String
    },
    armorItems: {
        type: Array
    },
    shieldItems: {
        type: Array
    },
    weaponItems: {
        type: Array
    },
    description: {
        type: String
    },
    creatorName: {
        type: String
    },
    downloadedTimes: { type: Number },
    race: { type: String },
    raceImag: { type: String },
    charClass: { type: String },
    currentLevel: { type: String },
    charName: { type: String }

}, {
    versionKey: false
})




const MarketCharItem = mongoose.model("MarketCharItem", MarketCharItemSchema, "marketCharItems");

module.exports = MarketCharItem