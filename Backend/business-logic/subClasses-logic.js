const SubClass = require("../models/subClassModel");
const mongoose = require('mongoose');

function getRelevantSubClasses(baseClass) {
    return SubClass.find({ baseClass: { $eq: baseClass } }).exec()
}

function getSubClass(name) {
    return SubClass.findOne({ name: { $eq: name } }).exec()
}


function createSubClass(subclass) {
    console.log(subclass)
    return subclass.save();
}

async function getAllSubClasses(start, end, _id, subclassType, baseClass) {
    console.log(subclassType)
    if (subclassType === 'true') {
        return SubClass.find({
            $and: [{ baseClass: { $eq: baseClass }, $or: [{ user_id: mongoose.Types.ObjectId(_id) }, { isPublic: true }] }]
        }).skip(parseInt(start)).limit(parseInt(end)).exec();
    }
    if (subclassType === null || subclassType === 'false') {
        return SubClass.find({ baseClass: { $eq: baseClass }, user_id: { $eq: mongoose.Types.ObjectId(_id) } }).skip(parseInt(start)).limit(parseInt(end)).exec();
    }
}

function searchSubClasses(text, _id, subclassType, baseClass) {

    if (subclassType === 'true') {
        return SubClass.find({
            $and: [{ baseClass: { $eq: baseClass }, $or: [{ user_id: mongoose.Types.ObjectId(_id) }, { isPublic: true }] }],
            name: { $regex: text, $options: "i" }
        }).exec();
    }
    if (subclassType === 'null' || subclassType === 'false') {
        return SubClass.find({ user_id: { $eq: mongoose.Types.ObjectId(_id) }, name: { $regex: text, $options: "i" } }).exec();
    }

}


module.exports = {
    getRelevantSubClasses,
    getSubClass,
    createSubClass,
    getAllSubClasses,
    searchSubClasses
}