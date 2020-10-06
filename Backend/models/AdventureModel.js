const mongoose = require('mongoose');

const AdventureSchema = mongoose.Schema({

    adventureName: {
        type: String,
        required: [true, "Missing Username"],
    },
    participants_id: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Character' }
    ],
    leader_id: {
        type: String
    },
    adventureSetting: {
        type: String
    },
    adventureIdentifier: {
        type: String
    }


}, {
    versionKey: false
})

AdventureSchema.virtual("characters", {
    ref: "Character",
    localField: "participants_id",
    foreignField: "_id",
    justOne: true
})

const Adventure = mongoose.model("Adventure", AdventureSchema, "adventures");

module.exports = Adventure