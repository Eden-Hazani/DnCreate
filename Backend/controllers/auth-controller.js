const express = require("express");
const authLogic = require('../business-logic/auth-logic');
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const errorHandler = require('../utilities/error-handler')
const router = express.Router();
var multer = require('multer');
const uuid = require('uuid');
const verifyInSystem = require('../middleware/validateUserInSystem')
const verifyLoggedIn = require('../middleware/verify-logged-in')
const validateExistingImage = require('../middleware/validateExistingImage')
const fs = require('fs');
const cors = require('cors')



const mailgun = require("mailgun-js");
const { response } = require("express");
const validateUserInSystem = require("../middleware/validateUserInSystem");
const mg = mailgun({ apiKey: config.mailGun_API.api, domain: config.mailGun_API.domain });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/profile-imgs')
    },
    filename: function (req, file, cb) {
        const name = JSON.parse(req.body.userInfo).profileImg
        const ext = name.substr(name.lastIndexOf('.'));
        cb(null, Date.now() + uuid.v4() + ext)
    }
})
var upload = multer({ storage: storage })



router.delete("/deleteAccount/:user_id", async (request, response) => {
    try {
        const user = request.params.user_id;
        const userInSystem = await authLogic.validateInSystem(request.params.user_id);
        if (userInSystem.profileImg) {
            fs.unlink(`./public/uploads/profile-imgs/${userInSystem.profileImg}`, function (err) {
                if (err) return console.log(err);
                console.log('file deleted successfully');
            });
        }
        await authLogic.deleteAccount(user);
        response.sendStatus(204);
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
})



router.post('/forgotPassword', upload.none(), async (request, response) => {
    try {
        const userInSystem = await authLogic.validateRegister(request.body.email)
        if (!userInSystem) {
            response.status(400).send('User Not in system!')
            return;
        }
        const resetPassValidation = uuid.v4();
        userInSystem.resetLink = resetPassValidation;
        const data = {
            from: 'noreplay@DncCreate.com',
            to: userInSystem.username,
            subject: 'Forgot Password',
            html: `
                <h2>Please Paste the code below in the application on order to reset your password</h2>
                <br><br>
                <p>${resetPassValidation}</p>
            `
        };
        await authLogic.addResetLink(userInSystem)
        mg.messages().send(data, function (error, body) {
            if (error) {
                return response.json({
                    message: error.message
                })
            }
            return response.json({ message: 'Email Has been sent In order to reset password.' })
        });
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
})


router.patch('/addProfilePicture', upload.single('image'), verifyLoggedIn, validateExistingImage, async (request, response) => {
    try {
        const userToUpdate = new User(response.locals.user);
        userToUpdate.profileImg = request.file.filename;
        const user = await authLogic.updateUser(userToUpdate);
        response.json({ user })
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
})

router.post('/resetPassword', upload.none(), async (request, response) => {
    try {
        const newUser = JSON.parse(request.body.validationInfo);
        const resetLinkValidation = newUser.validationCode;
        if (resetLinkValidation) {
            const validClaim = await authLogic.resetLinkValidator(resetLinkValidation);
            if (!validClaim) {
                return response.status(400).json('Wrong code or password has already been reset')
            }
            newUser.username = validClaim.username;
            newUser._id = validClaim._id;
            const newUserDetails = new User(newUser);
            const user = await authLogic.updateUserWithPassword(newUserDetails);
            response.json({ user })
        } else {
            return response.json({ message: 'Something Went Wrong' })
        }
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));

    }
})



router.get('/activate/:token', async (request, response) => {
    try {
        const registrationToken = request.params.token;
        if (registrationToken) {
            jwt.verify(registrationToken, config.jwt.secretKey, async function (err, decodedToken) {
                if (err) {
                    if (err.message === "jwt expired") {
                        return response.status(400).send('this activation request has been expired')
                    }
                    return response.status(400).json({ error: err.message })
                }
                const verify = await authLogic.validateRegister(JSON.parse(decodedToken.userInfo).username);
                if (verify.activated) {
                    return response.status(403).send('User has already been activated')
                }
                const newUser = verify;
                newUser.activated = true;
                await authLogic.updateUser(newUser);
                return response.redirect('https://dncreate.herokuapp.com/index.html')
            });
        } else {
            return response.json({ message: 'Something Went Wrong' })
        }
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));

    }
})

router.post("/resendActivationEmail", upload.none(), async (request, response) => {
    try {
        const newUser = new User(request.body)
        const validation = await authLogic.validateRegister(newUser.username);
        if (!validation) {
            response.status(403).send({ message: "No user in system" });
            return;
        }
        const userInfo = request.body;
        const token = jwt.sign({ userInfo }, config.jwt.secretKey, { expiresIn: "12h" })
        const data = {
            from: 'noreplay@DncCreate.com',
            to: validation.username,
            subject: 'Account Activation Link',
            html: `
                <h2> Please click on the following link to activate your account</h2>
                <br><br>
                <center>
                    <table align="center" cellspacing="0" cellpadding="0" width="100%">
                    <tr>
                        <td align="center" style="padding: 10px;">
                        <table border="0" class="mobile-button" cellspacing="0" cellpadding="0">
                            <tr>
                            <td align="center" bgcolor="#37882f" style="background-color: #37882f; margin: auto; max-width: 600px; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; padding: 15px 20px; " width="100%">
                            <!--[if mso]>&nbsp;<![endif]-->
                                <a href="${config.baseUrl}/api/auth/activate/${token}" target="_blank" style="16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight:normal; text-align:center; background-color: #37882f; text-decoration: none; border: none; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; display: inline-block;">
                                    <span style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight:normal; line-height:1.5em; text-align:center;">Activate</span>
                                </a>
                            <!--[if mso]>&nbsp;<![endif]-->
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    </table>
                </center>
            `
        };
        mg.messages().send(data, async function (error, body) {
            if (error) {
                console.log(error.message)
                return response.json({
                    message: error.message
                })
            }
            return response.json({ message: "The activation email has been sent to your email address." })
        });
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
})




router.post("/register", upload.none(), verifyInSystem, async (request, response) => {
    try {
        const newUser = new User(JSON.parse(request.body.userInfo));
        const error = await newUser.validate();
        if (error) {
            response.status(400).send(error.message);
            return;
        }
        const userInfo = request.body.userInfo;
        const token = jwt.sign({ userInfo }, config.jwt.secretKey, { expiresIn: "12h" })
        const data = {
            from: 'noreplay@DncCreate.com',
            to: newUser.username,
            subject: 'Account Activation Link',
            html: `
                <h2> Please click on the following link to activate your account</h2>
                <br><br>
                <center>
                    <table align="center" cellspacing="0" cellpadding="0" width="100%">
                    <tr>
                        <td align="center" style="padding: 10px;">
                        <table border="0" class="mobile-button" cellspacing="0" cellpadding="0">
                            <tr>
                            <td align="center" bgcolor="#37882f" style="background-color: #37882f; margin: auto; max-width: 600px; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; padding: 15px 20px; " width="100%">
                            <!--[if mso]>&nbsp;<![endif]-->
                                <a href="${config.baseUrl}/api/auth/activate/${token}" target="_blank" style="16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight:normal; text-align:center; background-color: #37882f; text-decoration: none; border: none; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; display: inline-block;">
                                    <span style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight:normal; line-height:1.5em; text-align:center;">Activate</span>
                                </a>
                            <!--[if mso]>&nbsp;<![endif]-->
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    </table>
                </center>
            `
        };
        mg.messages().send(data, async function (error, body) {
            if (error) {
                console.log(error.message)
                return response.json({
                    message: error.message
                })
            }
            newUser.activated = false;
            const user = await authLogic.register(newUser);
            return response.json({ message: "An Email has been sent to your email address, in order to unlock DnCreate's full features please use the activation link to activated your account.", user: user })

        });
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

router.post("/storeExpoToken", upload.none(), async (request, response) => {
    try {
        const user = new User(JSON.parse(request.body.user));
        authLogic.updateUser(user)
        console.log("User registered for notifications: ", user);
        response.status(201).send();
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});


router.post("/login", upload.none(), async (request, response) => {
    try {
        const credentials = new User(JSON.parse(request.body.credentials));
        const options = JSON.parse(request.body.options)
        const user = await authLogic.login(credentials);
        if (!user) {
            response.status(401).send("Incorrect username or password");
            return;
        }
        const token = jwt.sign({ user }, config.jwt.secretKey, !options.remainLoggedIn && { expiresIn: "2d" })
        response.json({ token });
    } catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

router.get("/isUserLogged", verifyLoggedIn, async (request, response) => {
    try {
        response.json(true);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.get("/isActivated", verifyLoggedIn, async (request, response) => {
    try {
        const user = await authLogic.validateInSystem(response.locals.user._id);
        if (user.activated) {
            response.json(true);
        }
        if (!user.activated) {
            response.json(false);
        }
    } catch (err) {
        response.status(500).send(err.message);
    }
});


router.post("/databaseLoginAdmin", cors(), async (request, response) => {
    try {
        const user = await authLogic.login(request.body);
        if (user.username === "mr.edenhazani@gmail.com") {
            response.json(true);
        } else {
            response.json(false);
        }
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.post("/databaseFindPersonAdmin", cors(), async (request, response) => {
    try {
        const user = await authLogic.findUserAsAdmin(request.body.username);
        response.json({ user });
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.post("/changePremiumStatusAdmin", cors(), async (request, response) => {
    try {
        const userToUpdate = new User(request.body);
        const user = await authLogic.updateUser(userToUpdate)
        response.json({ user });
    } catch (err) {
        response.status(500).send(err.message);
    }
});





module.exports = router;