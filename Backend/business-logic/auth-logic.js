const uuid = require('uuid');
const hash = require('../utilities/hash')
const User = require('../models/userModel');


function register(user) {
    user.uuid = uuid.v4();
    user.password = hash(user.password)
    return user.save();
}

function validateRegister(username) {
    return User.findOne({ username: { $eq: username } });
}

function resetLinkValidator(resetLink) {
    return User.findOne({ resetLink: { $eq: resetLink } });
}


function login(credentials) {
    credentials.password = hash(credentials.password);
    const user = User.findOne({ username: { $eq: credentials.username }, password: { $eq: credentials.password } });
    return user
}

async function updateUser(user) {
    const info = await User.updateOne({ _id: user._id }, user).exec();
    return info.n ? user : null;
}

async function updateUserWithPassword(user) {
    user.password = hash(user.password)
    user.resetLink = '';
    const info = await User.updateOne({ _id: user._id }, user).exec();
    return info.n ? user : null;
}

async function addResetLink(user) {
    const info = await User.updateOne({ _id: user._id }, user).exec();
    return info.n ? user : null;
}



module.exports = {
    register,
    validateRegister,
    login,
    updateUser,
    addResetLink,
    resetLinkValidator,
    updateUserWithPassword
}