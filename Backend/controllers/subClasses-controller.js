const express = require("express");
const subClassLogic = require('../business-logic/subClasses-logic')
const router = express.Router();
const verifyLogged = require('../middleware/verify-logged-in');
const SubClass = require("../models/subClassModel");
var multer = require('multer');
var upload = multer({})


router.post("/getSubClasses", verifyLogged, upload.none(), async (request, response) => {
    try {
        const classObj = JSON.parse(request.body.request);
        const subClasses = await subClassLogic.getAllSubClasses(classObj.start, classObj.end, classObj._id, classObj.subclassType, classObj.baseClass);
        response.json(subClasses);
    } catch (err) {
        response.status(500).send(err.message);
    }
});
router.post("/searchSubClasses", verifyLogged, upload.none(), async (request, response) => {
    try {
        const classObj = JSON.parse(request.body.search);
        const subClasses = await subClassLogic.searchSubClasses(classObj.text, classObj._id, classObj.subclassType, classObj.baseClass);
        response.json(subClasses);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/getSubClass/:name", verifyLogged, async (request, response) => {
    try {
        const name = request.params.name;
        const subClass = await subClassLogic.getSubClass(name);
        response.json(subClass);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.post("/addSubClass", verifyLogged, upload.none(), async (request, response) => {
    try {
        const subclass = new SubClass(JSON.parse(request.body.subclass))
        await subClassLogic.createSubClass(subclass);
        response.json(true);
    } catch (err) {
        response.status(500).send(err.message);
    }
});


module.exports = router;