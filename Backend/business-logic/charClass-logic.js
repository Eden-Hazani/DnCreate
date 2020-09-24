const CharClass = require("../models/charClassModel");

function getAllClasses() {
    return CharClass.find().exec();
}




module.exports = {
    getAllClasses
}