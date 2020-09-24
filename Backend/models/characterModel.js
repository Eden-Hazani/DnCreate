const mongoose = require('mongoose');

const CharacterSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "userId is required"],
    },
    name: {
        type: String
    },
    race: {
        type: String
    },
    age: {
        type: Number
    },
    height: {
        type: Number
    },
    weight: {
        type: Number
    },
    eyes: {
        type: String
    },
    skin: {
        type: String
    },
    hair: {
        type: String
    },
    strength: {
        type: Number
    },
    constitution: {
        type: Number
    },
    dexterity: {
        type: Number
    },
    intelligence: {
        type: Number
    },
    wisdom: {
        type: Number
    },
    charisma: {
        type: Number
    },
    modifiers: {
        strength: { type: Number },
        constitution: { type: Number },
        dexterity: { type: Number },
        intelligence: { type: Number },
        wisdom: { type: Number },
        charisma: { type: Number },
    },
    characterClass: {
        type: String
    },
    image: {
        type: String

    },
    backStory: {
        type: String
    },
    flaws: {
        type: Array
    },
    ideals: {
        type: Array
    },
    bonds: {
        type: Array
    },
    personalityTraits: {
        type: Array
    },
    level: {
        type: Number
    },
    skills: {
        type: Array
    },
    maxHp: {
        type: Number
    },
    items: {
        type: Array
    },
    currency: {
        gold: {
            type: Number
        },
        silver: {
            type: Number
        },
        copper: {
            type: Number
        }
    }

}, {
    versionKey: false
})


const Character = mongoose.model("Character", CharacterSchema, "characters");

module.exports = Character