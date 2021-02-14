const mongoose = require('mongoose');

const subClassSchema = mongoose.Schema({
    baseClass: {
        type: String
    },
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    levelUpChart: {
        type: Object
    },
    isPublic: {
        type: Boolean
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "userId is required"]
    }

}, {
    versionKey: false
})

subClassSchema.virtual("users", {
    ref: "User",
    localField: "user_id",
    foreignField: "_id",
    justOne: true
})


const SubClass = mongoose.model("SubClass", subClassSchema, "subClasses");

module.exports = SubClass