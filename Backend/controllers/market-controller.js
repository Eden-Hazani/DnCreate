const express = require("express");
const router = express.Router();
const verifyLogged = require('../middleware/verify-logged-in');
const MarketCharItem = require('../models/MarketCharItemModel');
const marketLogic = require('../business-logic/market-logic')
var multer = require('multer');
var upload = multer({});


router.post("/addCharToMarket", verifyLogged, upload.none(), async (request, response) => {
    try {
        console.log(JSON.parse(request.body.marketItem))
        const newCharMarketItem = new MarketCharItem(JSON.parse(request.body.marketItem));
        const newItem = await marketLogic.addCharToMarket(newCharMarketItem);
        response.json(newItem._id.toString());
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.delete("/removeCharFromMarket/:market_id", verifyLogged, async (request, response) => {
    try {
        const market_id = request.params.market_id;
        await marketLogic.removeFromMarket(market_id);
        response.sendStatus(204);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/getPrimeItems", verifyLogged, upload.none(), async (request, response) => {
    try {
        const items = await marketLogic.getPrimeItems();
        response.json(items);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/getMarketItem/:market_id", verifyLogged, upload.none(), async (request, response) => {
    try {
        const market_id = request.params.market_id;
        const item = await marketLogic.getSingleItem(market_id);
        response.json(item);
    } catch (err) {
        response.status(500).send(err.message);
    }
});


module.exports = router;