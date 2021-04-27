const mongoose = require('mongoose');

const MarketWeaponItemSchema = mongoose.Schema({

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
    image: {
        type: String
    },
    downloadedTimes: { type: Number },
    marketType: {
        type: String
    },
    weaponInfo: {
        _id: { type: String },
        dice: { type: String },
        diceAmount: { type: Number },
        name: { type: String },
        modifier: { type: String },
        isProficient: { type: Boolean },
        description: { type: String },
        specialAbilities: { type: String },
        image: { type: String },
        addedDamage: { type: Number },
        addedHitChance: { type: Number },
        removable: { type: Boolean },
        marketStatus: {
            isInMarket: { type: Boolean }, market_id: { type: String }, creator_id: { type: String }
        },
    }
}, {
    versionKey: false
})




const MarketWeaponItem = mongoose.model("MarketWeaponItem", MarketWeaponItemSchema, "marketWeaponItems");

module.exports = MarketWeaponItem