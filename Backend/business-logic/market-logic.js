const MarketCharItem = require("../models/MarketCharItemModel");


async function addCharToMarket(marketItem) {
    const newItem = await marketItem.save();
    newItem.currentLevelChar.marketStatus.market_id = newItem._id.toString();
    const info = await MarketCharItem.updateOne({ _id: newItem._id }, newItem).exec();
    return info.n ? marketItem : null;
}

function removeFromMarket(market_id) {
    return MarketCharItem.deleteOne({ _id: { $eq: market_id } }).exec()
}

function getSingleItem(market_id) {
    return MarketCharItem.findOne({ _id: { $eq: market_id } }).exec()
}


function getPrimeItems() {
    const result = MarketCharItem.aggregate([{ $project: { description: 1, creatorName: 1, race: 1, raceImag: 1, charClass: 1, currentLevel: 1, charName: 1 } }, { $sample: { size: 4 } }]).exec()
    return result
}


async function getItemBatch(start, end, classFilters, isTopDownloaded, search) {
    if (search) {
        if (classFilters.length > 0) {
            console.log(search)
            return MarketCharItem.aggregate([
                { "$match": { "charName": { "$regex": search, "$options": "i" } } },
                { "$match": { 'charClass': { '$in': classFilters } } },
                { $sort: { downloadedTimes: isTopDownloaded } }
            ]).skip(parseInt(start)).limit(parseInt(end)).exec();
        }
        else {
            return MarketCharItem.aggregate([
                { "$match": { "charName": { "$regex": search, "$options": "i" } } },
                { $sort: { downloadedTimes: isTopDownloaded } }
            ]).skip(parseInt(start)).limit(parseInt(end)).exec();
        }
    } else {
        if (classFilters.length > 0) {
            return MarketCharItem.aggregate([{ "$match": { 'charClass': { '$in': classFilters } } },
            { $sort: { downloadedTimes: isTopDownloaded } }]).skip(parseInt(start)).limit(parseInt(end)).exec();
        }
        else {
            return MarketCharItem.aggregate([{ $sort: { downloadedTimes: isTopDownloaded } }]).skip(parseInt(start)).limit(parseInt(end)).exec();
        }
    }
}

async function addDownloadNumber(market_id) {
    const marketItem = await MarketCharItem.findOne({ _id: { $eq: market_id } }).exec();
    const updatedVal = parseInt(marketItem.downloadedTimes) + 1;
    MarketCharItem.updateOne({ _id: marketItem._id }, { "$set": { "downloadedTimes": updatedVal } }).exec()
}



module.exports = {
    getPrimeItems,
    addCharToMarket,
    removeFromMarket,
    getSingleItem,
    getItemBatch,
    addDownloadNumber
}