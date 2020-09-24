const express = require("express");
const charClassLogic = require('../business-logic/charClass-logic')
const router = express.Router();
const verifyLogged = require('../middleware/verify-logged-in');

router.get("/charClassList", verifyLogged, async (request, response) => {
    try {
        const classes = await charClassLogic.getAllClasses();
        response.json(classes);
    } catch (err) {
        response.status(500).send(err.message);
    }
});


module.exports = router;