const express = require("express");
const raceLogic = require('../business-logic/race-logic')
const router = express.Router();
const verifyLogged = require('../middleware/verify-logged-in');
var multer = require('multer');
const uuid = require('uuid');
const fs = require('fs');
const Race = require("../models/raceModel");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/races')
    },
    filename: function (req, file, cb) {
        const name = JSON.parse(req.body.raceInfo).image
        const ext = name.substr(name.lastIndexOf('.'));
        cb(null, Date.now() + uuid.v4() + ext)
    }
})
var upload = multer({ storage: storage })

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

router.post("/addRace", verifyLogged, upload.single('image'), async (request, response) => {
    try {
        const race = new Race(JSON.parse(request.body.raceInfo))
        if (request.file) {
            race.image = request.file.filename;
        }
        const result = await raceLogic.createRace(race);
        response.json(true);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;