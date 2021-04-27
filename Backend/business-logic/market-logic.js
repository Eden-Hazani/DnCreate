const MarketCharItem = require("../models/MarketCharItemModel");
const MarketWeaponItem = require("../models/MarketWeaponItemModel");


async function addCharToMarket(marketItem) {
    const newItem = await marketItem.save();
    newItem.currentLevelChar.marketStatus.market_id = newItem._id.toString();
    const info = await MarketCharItem.updateOne({ _id: newItem._id }, newItem).exec();
    return info.n ? marketItem : null;
}

async function addWeaponToMarket(weaponItem) {
    const newItem = await weaponItem.save();
    newItem.weaponInfo.marketStatus.market_id = newItem._id.toString();
    const info = await MarketWeaponItem.updateOne({ _id: newItem._id }, newItem).exec();
    return info.n ? weaponItem : null;
}

function removeFromMarket(market_id, type) {
    if (type === 'char') {
        return MarketCharItem.deleteOne({ _id: { $eq: market_id } }).exec()
    } else if (type === 'weapon') {
        return MarketWeaponItem.deleteOne({ _id: { $eq: market_id } }).exec()
    }
}

function getSingleItem(market_id, type) {
    if (type === "CHAR") return MarketCharItem.findOne({ _id: { $eq: market_id } }).exec()
    else if (type === "WEAP") return MarketWeaponItem.findOne({ _id: { $eq: market_id } }).exec()
}


function getPrimeItems(marketType) {
    if (marketType === "CHAR") return MarketCharItem.aggregate([{ $project: { description: 1, creatorName: 1, race: 1, image: 1, charClass: 1, currentLevel: 1, itemName: 1, marketType: 1 } }, { $sample: { size: 4 } }]).exec()
    else if (marketType === "WEAP") return MarketWeaponItem.aggregate([{ $project: { description: 1, creatorName: 1, itemName: 1, marketType: 1, image: 1 } }, { $sample: { size: 4 } }]).exec()


}


async function getItemBatch(start, end, classFilters, isTopDownloaded, search, marketType) {
    if (search) {
        if (classFilters.length > 0 && marketType === "CHAR") {
            return MarketCharItem.aggregate([
                { "$match": { "itemName": { "$regex": search, "$options": "i" } } },
                { "$match": { 'charClass': { '$in': classFilters } } },
                { $sort: { downloadedTimes: isTopDownloaded } }
            ]).skip(parseInt(start)).limit(parseInt(end)).exec();
        }
        else if (marketType === "CHAR") {
            return MarketCharItem.aggregate([
                { "$match": { "itemName": { "$regex": search, "$options": "i" } } },
                { $sort: { downloadedTimes: isTopDownloaded } }
            ]).skip(parseInt(start)).limit(parseInt(end)).exec();
        }
        else if (marketType === "WEAP") {
            return MarketWeaponItem.aggregate([
                { "$match": { "itemName": { "$regex": search, "$options": "i" } } },
                { $sort: { downloadedTimes: isTopDownloaded } }
            ]).skip(parseInt(start)).limit(parseInt(end)).exec();
        }
    } else {
        if (classFilters.length > 0 && marketType === "CHAR") {
            return MarketCharItem.aggregate([{ "$match": { 'charClass': { '$in': classFilters } } },
            { $sort: { downloadedTimes: isTopDownloaded } }]).skip(parseInt(start)).limit(parseInt(end)).exec();
        }
        else {
            if (marketType === "CHAR") return MarketCharItem.aggregate([{ $sort: { downloadedTimes: isTopDownloaded } }]).skip(parseInt(start)).limit(parseInt(end)).exec();
            else if (marketType === "WEAP") return MarketWeaponItem.aggregate([{ $sort: { downloadedTimes: isTopDownloaded } }]).skip(parseInt(start)).limit(parseInt(end)).exec();
        }
    }
}





async function addDownloadNumber(market_id, marketType) {
    if (marketType === "CHAR") {
        const marketItem = await MarketCharItem.findOne({ _id: { $eq: market_id } }).exec();
        const updatedVal = parseInt(marketItem.downloadedTimes) + 1;
        MarketCharItem.updateOne({ _id: marketItem._id }, { "$set": { "downloadedTimes": updatedVal } }).exec()
        return;
    }
    else if (marketType === "WEAP") {
        const marketItem = await MarketWeaponItem.findOne({ _id: { $eq: market_id } }).exec();
        const updatedVal = parseInt(marketItem.downloadedTimes) + 1;
        MarketWeaponItem.updateOne({ _id: marketItem._id }, { "$set": { "downloadedTimes": updatedVal } }).exec()
        return;
    }
}



module.exports = {
    getPrimeItems,
    addCharToMarket,
    removeFromMarket,
    getSingleItem,
    getItemBatch,
    addDownloadNumber,
    addWeaponToMarket
}