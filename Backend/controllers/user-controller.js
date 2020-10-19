const express = require("express");
const userLogic = require('../business-logic/user-logic')
const router = express.Router();
const verifyLogged = require('../middleware/verify-logged-in');
const validateCharInSystem = require('../middleware/validateCharInSystem');
const Character = require("../models/characterModel");
var multer = require('multer');
var upload = multer({})



router.get("/validateChar/:charName/:user_id", verifyLogged, async (request, response) => {
    try {
        const charName = request.params.charName;
        const user_id = request.params.user_id;
        const validation = await userLogic.validateChar(charName, user_id);
        if (validation) {
            response.status(403).send(true)
            return;
        }
        response.json(false);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.patch("/updateCharacter", verifyLogged, upload.none(), async (request, response) => {
    try {
        const char = new Character(JSON.parse(request.body.charInfo));
        console.log(char)
        const error = await char.validate();
        if (error) {
            response.status(400).send(error.message)
        }
        await userLogic.updateCharacter(char);
        response.json(true);
    } catch (err) {
        response.status(500).send(err.message);
    }
})



router.post("/saveChar", verifyLogged, upload.none(), validateCharInSystem, async (request, response) => {
    try {
        console.log(JSON.parse(request.body.charInfo))
        const char = new Character(JSON.parse(request.body.charInfo));
        char.level = 1;
        char.items = [];
        char.currency.gold = 0;
        char.currency.silver = 0;
        char.currency.copper = 0;
        const error = await char.validate();
        if (error) {
            response.status(400).send(error.message)
        }
        const addedChar = await userLogic.addCharacter(char);
        response.json(addedChar);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/getChars/:user_id", verifyLogged, async (request, response) => {
    try {
        const user_id = request.params.user_id
        const chars = await userLogic.getCharacters(user_id);
        response.json(chars);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/getChar/:_id", verifyLogged, async (request, response) => {
    try {
        const _id = request.params._id
        const char = await userLogic.getChar(_id);
        response.json(char);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.delete("/deleteChar/:char_id", verifyLogged, async (request, response) => {
    try {
        const char_id = request.params.char_id;
        await userLogic.removeCharacter(char_id);
        response.sendStatus(204);
    } catch (err) {
        response.status(500).send(err.message);
    }
});




module.exports = router;