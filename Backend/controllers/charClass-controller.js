const express = require("express");
const charClassLogic = require('../business-logic/charClass-logic')
const router = express.Router();

router.get("/charClassList", async (request, response) => {
    try {
        const classes = await charClassLogic.getAllClasses();
        response.json(classes);
    } catch (err) {
        response.status(500).send(err.message);
    }
});


module.exports = router;