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

router.get("/raceList/:start/:end/:user_id/:raceType/:isPopularOrder", async (request, response) => {
    try {
        const start = request.params.start;
        const end = request.params.end;
        const _id = request.params.user_id;
        const raceType = request.params.raceType;
        const isPopularOrder = request.params.isPopularOrder;
        const races = await raceLogic.getAllRaces(start, end, _id, raceType, isPopularOrder);
        response.json(races);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/getPrimeRaceList/:popularity/:raceType/:user_id", async (request, response) => {
    try {
        const popularity = request.params.popularity;
        const raceType = request.params.raceType;
        const user_id = request.params.user_id;
        const races = await raceLogic.getPrimeRaces(popularity, raceType, user_id);
        response.json(races);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/getUserCreatedRaces/:uid", verifyLogged, async (request, response) => {
    try {
        const uid = request.params.uid;
        const races = await raceLogic.getUserCreatedRaces(uid)
        response.json(races);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.patch("/editCustomRace", verifyLogged, upload.single('image'), async (request, response) => {
    try {
        const race = new Race(JSON.parse(request.body.raceInfo))
        if (request.file) {
            const raceSnapShot = await raceLogic.getRace(JSON.parse(request.body.raceInfo)._id);
            if (raceSnapShot.image) {
                fs.unlink(`./public/assets/races/${raceSnapShot.image}`, function (err) {
                    if (err) return console.log(err);
                    console.log('file deleted successfully');
                });
            }
            race.image = request.file.filename;
        }
        const updatedRace = await raceLogic.updateCustomRace(race);
        response.json(updatedRace);
    } catch (err) {
        response.status(500).send(err.message);
    }
});


router.get("/searchRace/:text/:raceType/:user_id", async (request, response) => {
    try {
        const raceType = request.params.raceType;
        const user_id = request.params.user_id;
        const items = await raceLogic.searchRaces(request.params.text, raceType, user_id);
        response.json(items);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.post("/addRace", verifyLogged, upload.single('image'), async (request, response) => {
    try {
        console.log(JSON.parse(request.body.raceInfo))
        console.log(new Race(JSON.parse(request.body.raceInfo)))
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

router.post("/popularizeAllRaces", verifyLogged, upload.none(), async (request, response) => {
    try {
        // console.log(request.body.raceInfo)
        console.log(JSON.parse(request.body.raceInfo))
        response.json(true);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;