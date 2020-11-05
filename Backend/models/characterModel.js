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
    magic: {
        cantrips: { type: Number },
        firstLevelSpells: { type: Number },
        secondLevelSpells: { type: Number },
        thirdLevelSpells: { type: Number },
        forthLevelSpells: { type: Number },
        fifthLevelSpells: { type: Number },
        sixthLevelSpells: { type: Number },
        seventhLevelSpells: { type: Number },
        eighthLevelSpells: { type: Number },
        ninthLevelSpells: { type: Number },
    },
    spells: {
        cantrips: { type: Array },
        firstLevelSpells: { type: Array },
        secondLevelSpells: { type: Array },
        thirdLevelSpells: { type: Array },
        forthLevelSpells: { type: Array },
        fifthLevelSpells: { type: Array },
        sixthLevelSpells: { type: Array },
        seventhLevelSpells: { type: Array },
        eighthLevelSpells: { type: Array },
        ninthLevelSpells: { type: Array },
    },
    charSpecials: {
        rageAmount: { type: Number },
        rageDamage: { type: Number },
        fightingStyle: { type: Array },
        warlockPactBoon: { type: Object },
        kiPoints: { type: Number },
        martialPoints: { type: Number },
        sneakAttackDie: { type: Number },
        sorceryPoints: { type: Number },
        sorcererMetamagic: { type: Array },
        eldritchInvocations: { type: Array },
        warlockPatron: { type: String },
        battleMasterManeuvers: { type: Array },
        druidCircle: { type: String },
        monkElementsDisciplines: { type: Array },
        companion: { type: Array },
        warlockSpellSlotLevel: { type: String },
        warlockSpellSlots: { type: Number }
    },
    spellCastingClass: { type: String },
    spellsKnown: {
        type: String
    },
    unrestrictedKnownSpells: {
        type: Number
    },
    differentClassSpellsToPick: {
        type: Array
    },
    characterClass: {
        type: String,
    },
    characterClassId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CharClass"
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
    nonClassAvailableSpells: {
        type: Array
    },
    tools: {
        type: Array
    },
    maxHp: {
        type: Number
    },
    items: {
        type: Array
    },
    path: {
        type: Object
    },
    pathFeatures: {
        type: Array
    },
    addedWeaponProf: {
        type: Array
    },
    addedArmorProf: {
        type: Array
    },
    feats: {
        type: Array
    },
    equippedArmor: {
        id: { type: String },
        name: { type: String },
        ac: { type: Number },
        baseAc: { type: Number },
        disadvantageStealth: { type: Boolean },
        armorType: { type: String },
        armorBonusesCalculationType: { type: String }
    },
    languages: {
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
    versionKey: false,
    toJSON: { virtuals: true }

})

CharacterSchema.virtual("users", {
    ref: "User",
    localField: "user_id",
    foreignField: "_id",
    justOne: true
})

CharacterSchema.virtual("charClasses", {
    ref: "CharClass",
    localField: "characterClassId",
    foreignField: "_id",
    justOne: true
})

const Character = mongoose.model("Character", CharacterSchema, "characters");

module.exports = Character