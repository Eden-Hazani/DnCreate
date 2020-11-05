const express = require("express");
const raceLogic = require('../business-logic/race-logic')
const router = express.Router();
const verifyLogged = require('../middleware/verify-logged-in');


router.get("/raceList", async (request, response) => {
    try {
        const races = await raceLogic.getAllRaces();
        response.json(races);
    } catch (err) {
        response.status(500).send(err.message);
    }
});


router.get("/searchRace/:text", async (request, response) => {
    try {
        const items = await raceLogic.searchRaces(request.params.text);
        response.json(items);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;