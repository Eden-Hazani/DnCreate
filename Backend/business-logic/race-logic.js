const Race = require("../models/raceModel");
const mongoose = require('mongoose');
const Character = require("../models/characterModel");


async function getAllRaces(start, end, _id, raceType, isPopularOrder) {
    if (_id === 'noUserId') {
        return Race.find({
            user_id: { $exists: false },
        }).skip(parseInt(start)).limit(parseInt(end)).exec();
    }
    if (raceType === 'true') {
        if (isPopularOrder === 'true') {
            return Race.aggregate([
                { $match: { $or: [{ user_id: mongoose.Types.ObjectId(_id) }, { visibleToEveryone: true }, { visibleToEveryone: { $exists: false } }] } }
                , { $sort: { popularity: parseInt(isPopularOrder) } }]).skip(parseInt(start)).limit(parseInt(end)).exec();
        }
        return Race.find({
            $or: [{ user_id: mongoose.Types.ObjectId(_id) }, { visibleToEveryone: true }, { visibleToEveryone: { $exists: false } }],
        }).skip(parseInt(start)).limit(parseInt(end)).exec();
    }
    if (raceType === 'null' || raceType === 'false') {
        if (isPopularOrder === 'true') {
            return Race.aggregate([
                {
                    $match: {
                        $and: [{
                            $or: [{ visibleToEveryone: { $eq: false } }, { visibleToEveryone: { $exists: false } }],
                            $or: [{ user_id: { $eq: mongoose.Types.ObjectId(_id) } }, { user_id: { $exists: false } }]
                        }]
                    }
                }
                , { $sort: { popularity: parseInt(isPopularOrder) } }]).skip(parseInt(start)).limit(parseInt(end)).exec();
        }
        return Race.find({
            $or: [{ visibleToEveryone: { $eq: false } }, { visibleToEveryone: { $exists: false } }],
            $or: [{ user_id: { $eq: mongoose.Types.ObjectId(_id) } }, { user_id: { $exists: false } }],
        }).skip(parseInt(start)).limit(parseInt(end)).exec();
    }


}

function getUserCreatedRaces(_id) {
    return Race.find({ user_id: { $eq: mongoose.Types.ObjectId(_id) } }).exec();
}

async function updateCustomRace(race) {
    const info = await Race.findOneAndUpdate({ user_id: race.user_id }, race,
        { new: true, useFindAndModify: false }).exec();
    return info
}


function searchRaces(text, raceType, _id) {
    if (_id === 'Offline') {
        return Race.find({
            user_id: { $exists: false },
            name: { $regex: text, $options: "i" }
        }).exec();
    }
    if (raceType === 'true') {
        return Race.find({
            $or: [{ user_id: mongoose.Types.ObjectId(_id) }, { visibleToEveryone: true }, { visibleToEveryone: { $exists: false } }],
            name: { $regex: text, $options: "i" }
        }).exec();
    }
    if (raceType === 'null' || raceType === 'false') {
        return Race.find({
            $or: [{ visibleToEveryone: { $eq: false } }, { visibleToEveryone: { $exists: false } }],
            $or: [{ user_id: { $eq: mongoose.Types.ObjectId(_id) } }, { user_id: { $exists: false } }],
            name: { $regex: text, $options: "i" }
        }).exec();
    }
}

function createRace(race) {
    return race.save();
}

function getRace(_id) {
    return Race.findOne({ _id: { $eq: _id } }).exec()
}

function popularizeAllRaces() {
    Race.find({}, function (err, races) {
        races.map(async (item) => {
            const characters = await Character.find({ raceId: { $eq: item._id.toString() } }).exec();
            item.popularity = characters.length
            await Race.findOneAndUpdate({ _id: item._id }, item, { new: true, useFindAndModify: false }).exec();
        })
    })
}

function getPrimeRaces(popularity, raceType, user_id) {
    if (!popularity || popularity === 'false') {
        return Race.find().skip(0).limit(20).exec();
    }
    if (user_id === 'noUserId') {
        return Race.aggregate([
            { $match: { user_id: { $exists: false } } }, { $sort: { popularity: parseInt(popularity) } }
        ]).skip(0).limit(20).exec();
    }
    if (raceType === 'true') {
        return Race.aggregate([
            { $match: { $or: [{ user_id: mongoose.Types.ObjectId(user_id) }, { visibleToEveryone: true }, { visibleToEveryone: { $exists: false } }] } }
            , { $sort: { popularity: parseInt(popularity) } }]).skip(0).limit(20).exec();
    }
    if (raceType === 'null' || raceType === 'false') {
        const races = Race.aggregate([
            {
                $match: {
                    $and: [{
                        $or: [{ visibleToEveryone: { $eq: false } }, { visibleToEveryone: { $exists: false } }],
                        $or: [{ user_id: { $eq: mongoose.Types.ObjectId(user_id) } }, { user_id: { $exists: false } }]
                    }]
                }
            }
            , { $sort: { popularity: parseInt(popularity) } }]).skip(0).limit(20).exec();
        return races
    }
}

module.exports = {
    getRace,
    getAllRaces,
    searchRaces,
    createRace,
    getPrimeRaces,
    getUserCreatedRaces,
    updateCustomRace,
    popularizeAllRaces
}