const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({

    senderName: {
        type: String
    },
    sender_id: {
        type: String
    },
    adventure_id: {
        type: String
    },
    message: {
        type: String
    },
    date: {
        type: Date
    },
    adventureIdentifier: {
        type: Number
    },
    uid: {
        type: String
    }

}, {
    versionKey: false
})



const Message = mongoose.model("Message", MessageSchema, "messages");

module.exports = Message