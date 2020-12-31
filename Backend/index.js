
if (process.env.PORT) {
  console.log('prod')
  global.config = require("./config/production.json");
} else {
  console.log('dev')
  global.config = require("./config/development.json");
}
require("./data-access-layer/dal");
const express = require("express");
const helmet = require("helmet");
const raceController = require("./controllers/race-controller")
const charClassController = require("./controllers/charClass-controller")
const authController = require("./controllers/auth-controller")
const userController = require("./controllers/user-controller")
const adventureController = require("./controllers/adventure-controller")
const compression = require("compression");
const config = require("config");
const app = express();
const cors = require('cors')

//..
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(helmet());
app.use(compression());

app.options('/api/auth/databaseLoginAdmin', cors())
app.options('/api/auth/databaseFindPersonAdmin', cors())
app.options('/api/auth/changePremiumStatusAdmin', cors())

app.use("/api/auth", authController);
app.use("/api/races", raceController);
app.use("/api/classes", charClassController);
app.use("/api/user", userController);
app.use("/api/adventures", adventureController);

const port = process.env.PORT || config.get("port");
app.listen(port, function () {
  console.log(`Server started on port ${port}...`);
});
