const Message = require("../models/MessageModel");


function getMessages(adventure_id, start, end) {
    const messages = Message.find({ adventure_id: adventure_id }).sort({ _id: -1 }).skip(parseInt(start)).limit(parseInt(end)).exec()
    return messages
}

function saveMessage(message) {
    return message.save();
}


module.exports = {
    saveMessage,
    getMessages
}