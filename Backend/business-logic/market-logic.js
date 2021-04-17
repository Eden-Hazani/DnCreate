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


module.exports = {
    getPrimeItems,
    addCharToMarket,
    removeFromMarket,
    getSingleItem
}