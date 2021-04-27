const express = require("express");
const router = express.Router();
const verifyLogged = require('../middleware/verify-logged-in');
const MarketCharItem = require('../models/MarketCharItemModel');
const MarketWeaponItem = require('../models/MarketWeaponItemModel');
const marketLogic = require('../business-logic/market-logic')
var multer = require('multer');
var upload = multer({});


router.post("/addToMarket/:type", verifyLogged, upload.none(), async (request, response) => {
    try {
        const type = request.params.type;
        if (type === 'CHAR') {
            const newItem = await marketLogic.addCharToMarket(new MarketCharItem(JSON.parse(request.body.marketItem)));
            response.json(newItem._id.toString());
            return;
        }
        else if (type === 'WEAP') {
            const newItem = await marketLogic.addWeaponToMarket(new MarketWeaponItem(JSON.parse(request.body.marketItem)));
            response.json(newItem);
            return;
        }
    } catch (err) {
        response.status(500).send(err.message);
    }
});



router.delete("/removeItemFromMarket/:market_id/:type", verifyLogged, async (request, response) => {
    try {
        const market_id = request.params.market_id;
        const type = request.params.type;
        await marketLogic.removeFromMarket(market_id, type);
        response.sendStatus(204);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/getPrimeItems/:marketType", verifyLogged, upload.none(), async (request, response) => {
    try {
        const marketType = request.params.marketType;
        const items = await marketLogic.getPrimeItems(marketType);
        response.json(items);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.post("/getItemBatch/:marketType", verifyLogged, upload.none(), async (request, response) => {
    try {
        const filters = JSON.parse(request.body.filters);
        const start = request.body.start
        const end = request.body.end
        const search = request.body.search
        const marketType = request.params.marketType;
        const items = await marketLogic.getItemBatch(start, end, filters.classFilters, filters.topDownLoaded, search, marketType)
        console.log(items)
        response.json(items);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/getMarketItem/:market_id/:type", verifyLogged, upload.none(), async (request, response) => {
    try {
        const market_id = request.params.market_id;
        const type = request.params.type;
        const item = await marketLogic.getSingleItem(market_id, type);
        response.json(item);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.patch("/addToItemDownloadAmount/:type/:market_id", verifyLogged, async (request, response) => {
    try {
        const type = request.params.type;
        const market_id = request.params.market_id;
        const result = await marketLogic.addDownloadNumber(market_id, type)
        response.json(result);
    } catch (err) {
        response.status(500).send(err.message);
    }
});


module.exports = router;