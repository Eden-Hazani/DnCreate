const mongoose = require('mongoose');

const MarketSpellItemSchema = mongoose.Schema({
    creator_id: {
        type: String
    },
    description: {
        type: String
    },
    creatorName: {
        type: String
    },
    itemName: {
        type: String
    },
    downloadedTimes: { type: Number },
    image: { type: String },
    marketType: {
        type: String
    },
    spell: {
        _id: { type: String },
        casting_time: { type: String },
        classes: { type: Array },
        higher_levels: { type: String },
        materials_needed: { type: String },
        description: { type: String },
        duration: { type: String },
        range: { type: String },
        level: { type: String },
        name: { type: String },
        school: { type: String },
        type: { type: String },
        marketStatus: {
            isInMarket: { type: Boolean }, market_id: { type: String }, creator_id: { type: String }
        },
    }
}, {
    versionKey: false
})




const MarketSpellItem = mongoose.model("MarketSpellItem", MarketSpellItemSchema, "marketSpellItems");

module.exports = MarketSpellItem