const express = require("express");
const adventureLogic = require('../business-logic/adventure-logic')
const router = express.Router();
const verifyLogged = require('../middleware/verify-logged-in');
const verifyUserInAdventure = require('../middleware/verifyUserInAdventure');
const validateUserIsLeader = require('../middleware/validateUserIsLeader');
var multer = require('multer');
const Adventure = require("../models/AdventureModel");
var upload = multer({})

router.post("/createAdventure", verifyLogged, upload.none(), async (request, response) => {
    try {
        const adventure = new Adventure(JSON.parse(request.body.adventure))
        adventure.adventureIdentifier = Math.floor((Math.random() * 1000000) + 1);
        const savedAdventure = await adventureLogic.createAdventure(adventure);
        response.json(savedAdventure);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.post("/getUsersProfilePic", verifyLogged, upload.none(), async (request, response) => {
    try {
        console.log('ff')
        const userList = JSON.parse(request.body.userList);
        const picList = await adventureLogic.getUsersProfilePicture(userList)
        response.json({ list: picList });

    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.patch("/updateAdventure", verifyLogged, upload.none(), verifyUserInAdventure, async (request, response) => {
    try {
        const adventure = new Adventure(JSON.parse(request.body.adventure))
        const updatedAdventure = await adventureLogic.updateAdventure(adventure);
        response.json(updatedAdventure);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.patch("/leaveAdventure", verifyLogged, upload.none(), async (request, response) => {
    try {
        const adventure = new Adventure(JSON.parse(request.body.adventure));
        const updatedAdventure = await adventureLogic.updateAdventure(adventure);
        response.json(updatedAdventure);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/getLeadingAdventures/:user_id", upload.none(), async (request, response) => {
    try {
        const user_id = request.params.user_id;
        const adventures = await adventureLogic.getLeadingAdventures(user_id);
        response.json(adventures);
    } catch (err) {
        response.status(500).send(err.message);
    }
});
router.get("/getSingleLeadingAdventure/:user_id/:adventureIdentifier", upload.none(), async (request, response) => {
    try {
        const user_id = request.params.user_id;
        const adventureIdentifier = request.params.adventureIdentifier;
        const adventure = await adventureLogic.getSingleLeadingAdventure(user_id, adventureIdentifier);
        response.json(adventure);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.post("/getParticipatingAdventures", verifyLogged, upload.none(), async (request, response) => {
    try {
        const characters = JSON.parse(request.body.characters);
        let adventures = []
        for (let character of characters) {
            let adv = await adventureLogic.getParticipatingAdventures(character);
            if (adv.length === 0) {
                continue
            }
            adventures.push(adv);
        }
        response.json(adventures);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/findAdventure/:adventureIdentifier", verifyLogged, async (request, response) => {
    try {
        const adventureIdentifier = request.params.adventureIdentifier;
        const adventure = await adventureLogic.findAdventure(adventureIdentifier);
        if (adventure.length === 0) {
            response.status(400).send('Invalid Adventure Identifier');
            return;
        }
        response.json(adventure);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.delete("/deleteAdventure/:adventureIdentifier/:leader_id", verifyLogged, validateUserIsLeader, async (request, response) => {
    try {
        const adventureIdentifier = request.params.adventureIdentifier;
        await adventureLogic.removeAdventure(adventureIdentifier);
        response.sendStatus(204);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/userInAdv/:user_id/:adventureIdentifier", async (request, response) => {
    try {
        const adventureIdentifier = request.params.adventureIdentifier
        const user_id = request.params.user_id;
        const adventure = await adventureLogic.findAdventure(adventureIdentifier).populate('participants_id').exec();
        if (adventure.length === 0) {
            response.status(400).send('This adventure no longer exists');
            return;
        }
        const inAdv = adventure[0].participants_id.map(participant => user_id === participant.user_id.toString())
        if (adventure[0].participants_id.length === 0) {
            const isEmpty_idInAdv = await adventureLogic.findAdventure(adventureIdentifier)
            if (isEmpty_idInAdv.length > 0) {
                for (let item of isEmpty_idInAdv) {
                    item.participants_id = [];
                    adventureLogic.updateAdventure(item);
                }
            }
            response.status(400).send('You are not part of this adventure');
            return;
        }
        if (!inAdv.includes(true)) {
            response.status(400).send('You are not part of this adventure, please refresh your list');
            return;
        }
        response.json(true);
    } catch (err) {
        response.status(500).send(err.message);
    }
});


module.exports = router;