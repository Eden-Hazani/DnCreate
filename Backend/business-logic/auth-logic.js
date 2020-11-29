const uuid = require('uuid');
const hash = require('../utilities/hash')
const User = require('../models/userModel');
const Character = require('../models/characterModel');


function register(user) {
    user.uuid = uuid.v4();
    user.password = hash(user.password)
    return user.save();
}

function validateRegister(username) {
    console.log(username)
    return User.findOne({ username: { $eq: username } });
}

function validateInSystem(_id) {
    return User.findOne({ _id: { $eq: _id } });
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

async function deleteAccount(_id) {
    return User.deleteOne({ _id }).exec().then(() => {
        Character.deleteMany({ user_id: { $eq: _id } }).exec()
    });
}


module.exports = {
    register,
    validateRegister,
    login,
    updateUser,
    addResetLink,
    resetLinkValidator,
    updateUserWithPassword,
    deleteAccount,
    validateInSystem
}