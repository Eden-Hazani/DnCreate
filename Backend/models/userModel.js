const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    username: {
        type: String,
        required: [true, "Missing Username"],

    },
    password: {
        type: String,
        required: [true, "Missing password"],

    },
    profileImg: {
        type: String,
    },
    resetLink: {
        type: String
    },
    activated: {
        type: Boolean
    },
    premium: {
        type: Boolean
    }

}, {
    versionKey: false
})


userSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.password;
    return obj;
}


const User = mongoose.model("User", userSchema, "users");

module.exports = User