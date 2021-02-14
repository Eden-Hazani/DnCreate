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
    languages: {
        type: Array
    },
    raceColors: {
        type: String
    },
    raceAbilities: {
        age: { type: String },
        alignment: { type: String },
        size: { type: String },
        speed: { type: Number },
        languages: { type: String },
        uniqueAbilities: { type: Array }
    },
    baseWeaponProficiencies: { type: Array },
    baseArmorProficiencies: { type: Array },
    baseAddedSkills: { type: Array },
    skillPickChoice: { type: Object },
    toolProficiencyPick: { type: Object },
    extraLanguages: { type: Number },
    changeBaseAttributePoints: { type: Object },

    customWeaponProficiencies: { type: Object },
    customArmorProficiencies: { type: Object },
    addedSpells: { type: Array },
    addedACPoints: { type: Number },
    baseAddedTools: { type: Array },
    userPickedFeatures: { type: Array },
    numberOfFeaturesToPick: { type: Number },
    visibleToEveryone: { type: Boolean },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "userId is required"]
    }

}, {
    versionKey: false
})

raceSchema.virtual("users", {
    ref: "User",
    localField: "user_id",
    foreignField: "_id",
    justOne: true
})


const Race = mongoose.model("Race", raceSchema, "races");

module.exports = Race