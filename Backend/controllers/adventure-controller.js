const express = require("express");
const adventureLogic = require('../business-logic/adventure-logic')
const router = express.Router();
const verifyLogged = require('../middleware/verify-logged-in');
const verifyUserInAdventure = require('../middleware/verifyUserInAdventure');
const validateUserIsLeader = require('../middleware/validateUserIsLeader');
var multer = require('multer');
const Adventure = require("../models/AdventureModel");
const sendPushNotification = require("../utilities/pushNotifications");
const authLogic = require("../business-logic/auth-logic");
const userLogic = require("../business-logic/user-logic")
const messageLogic = require("../business-logic/message-logic")
const { Expo } = require("expo-server-sdk");
const uuid = require('uuid');
const fs = require('fs');
const Message = require("../models/MessageModel");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/adventure-backgrounds')
    },
    filename: function (req, file, cb) {
        const name = JSON.parse(req.body.adventure).backgroundImage
        const ext = name.substr(name.lastIndexOf('.'));
        cb(null, Date.now() + uuid.v4() + ext)
    }
})

const galleryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = JSON.parse(req.body.adventure)._id
        if (!fs.existsSync('public/uploads/adventure-galleries/' + dir)) {
            fs.mkdirSync('public/uploads/adventure-galleries/' + dir);
        }
        cb(null, 'public/uploads/adventure-galleries/' + dir)
    },
    filename: function (req, file, cb) {
        const name = JSON.parse(req.body.imageObj).photoUri
        const ext = name.substr(name.lastIndexOf('.'));
        cb(null, Date.now() + uuid.v4() + ext)
    }
})

var upload = multer({ storage: storage })
var uploadToGallery = multer({ storage: galleryStorage })

router.post("/createAdventure", verifyLogged, upload.single('backgroundImage'), async (request, response) => {
    try {
        const adventure = new Adventure(JSON.parse(request.body.adventure))
        if (request.file) {
            adventure.backgroundImage = request.file.filename;
        }
        adventure.adventureIdentifier = Math.floor((Math.random() * 1000000) + 1);
        const savedAdventure = await adventureLogic.createAdventure(adventure);
        response.json(savedAdventure);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.post("/addImgToGallery", verifyLogged, uploadToGallery.single("newImage"), async (request, response) => {
    try {
        const adventure = new Adventure(JSON.parse(request.body.adventure))
        const imageObj = JSON.parse(request.body.imageObj)
        if (adventure.uploadedPhotoArray.length === 0) {
            adventure.uploadedPhotoArray = [];
        }
        const galleryObj = {
            description: imageObj.description,
            photoUri: request.file.filename,
        }
        adventure.uploadedPhotoArray.push(galleryObj)
        const updatedAdventure = await adventureLogic.updateAdventure(adventure);
        global.socketServer.emit(`adventure-${updatedAdventure._id}-change`, updatedAdventure);
        response.json(updatedAdventure);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.patch("/removeImgFromGallery/:imageUrl/:adventure_id", verifyLogged, upload.none(), async (request, response) => {
    try {
        const adventure = new Adventure(JSON.parse(request.body.adventure))
        const adventure_id = request.params.adventure_id;
        const imageUrl = request.params.imageUrl;
        fs.unlink(`public/uploads/adventure-galleries/${adventure_id}/${imageUrl}`, function (err) {
            if (err) return console.log(err);
            console.log('file deleted successfully');
        });
        const updatedAdventure = await adventureLogic.updateAdventure(adventure);
        global.socketServer.emit(`adventure-${updatedAdventure._id}-change`, updatedAdventure);
        response.json(updatedAdventure);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.post("/getUsersProfilePic", verifyLogged, upload.none(), async (request, response) => {
    try {
        const userList = JSON.parse(request.body.userList);
        const picList = await adventureLogic.getUsersProfilePicture(userList)
        response.json({ list: picList });

    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.patch("/updateAdventure", verifyLogged, upload.none(), async (request, response) => {
    try {
        const targetUser = await authLogic.validateInSystem(JSON.parse(request.body.adventure).leader_id)
        const joiningUserCharacter = await userLogic.getChar(JSON.parse(request.body.adventure).participants_id[JSON.parse(request.body.adventure).participants_id.length - 1])
        const adventure = new Adventure(JSON.parse(request.body.adventure))
        const { expoPushToken } = targetUser;
        if (Expo.isExpoPushToken(expoPushToken)) {
            await sendPushNotification(expoPushToken, "New adventurer has joined", `${joiningUserCharacter.name} has joined ${adventure.adventureName}`);
        }
        const updatedAdventure = await adventureLogic.updateAdventure(adventure);
        global.socketServer.emit(`adventure-${updatedAdventure._id}-change`, updatedAdventure);
        response.json(updatedAdventure);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.patch("/editAdventure", verifyLogged, upload.none(), async (request, response) => {
    try {
        const adventure = new Adventure(JSON.parse(request.body.adventure))
        const updatedAdventure = await adventureLogic.updateAdventure(adventure);
        response.json(updatedAdventure);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.patch("/addAdventureParticipant", verifyLogged, upload.none(), verifyUserInAdventure, async (request, response) => {
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
        global.socketServer.emit(`adventure-removedChange`, updatedAdventure.adventureIdentifier);
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
        const adventure = await adventureLogic.findAdventure(adventureIdentifier);
        if (adventure[0].backgroundImage) {
            fs.unlink(`./public/uploads/adventure-backgrounds/${adventure[0].backgroundImage}`, function (err) {
                if (err) return console.log(err);
                console.log('file deleted successfully');
            });
        }
        fs.rmdirSync('public/uploads/adventure-galleries/' + adventure[0]._id.toString(), { recursive: true });

        await adventureLogic.removeAdventure(adventureIdentifier);
        global.socketServer.emit(`adventure-removedChange`, adventureIdentifier);
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

router.post("/sendMessage", verifyLogged, upload.none(), async (request, response) => {
    try {
        const message = new Message(JSON.parse(request.body.message));
        const targetAdventure = await adventureLogic.findAdventure(message.adventureIdentifier);
        for (let charId of targetAdventure[0].participants_id) {
            if (charId.toString() !== message.sender_id) {
                let char = await userLogic.getChar(charId.toString());
                let user = await authLogic.validateInSystem(char.user_id.toString())
                const { expoPushToken } = user;
                if (Expo.isExpoPushToken(expoPushToken)) {
                    await sendPushNotification(expoPushToken, `${message.senderName}`, `${message.message}`);
                }
            }
        }
        if (message.sender_id !== targetAdventure[0].leader_id) {
            let user = await authLogic.validateInSystem(targetAdventure[0].leader_id)
            const { expoPushToken } = user;
            if (Expo.isExpoPushToken(expoPushToken)) {
                await sendPushNotification(expoPushToken, `${message.senderName}`, `${message.message}`);
            }
        }

        global.socketServer.emit(`adventure${message.adventure_id}-messageUpdate`, message);
        messageLogic.saveMessage(message)
        response.sendStatus(200);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/getMessages/:adventure_id/:start/:end", verifyLogged, upload.none(), async (request, response) => {
    try {
        const adventure_id = request.params.adventure_id;
        const start = request.params.start;
        const end = request.params.end;
        const messages = await messageLogic.getMessages(adventure_id, start, end)
        response.json(messages);
    } catch (err) {
        response.status(500).send(err.message);
    }
});



module.exports = router;