require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const loginHandler = require("./lambda_functions/loginHandler");
const registerHandler = require("./lambda_functions/registerHandler");
const searchMusicHandler = require("./lambda_functions/searchMusicHandler");
const addSubscriptionHandler = require("./lambda_functions/addSubscriptionHandler");
const deleteSubscriptionHandler = require("./lambda_functions/deleteSubscriptionHandler");
const getSubscriptionByUsernameHandler = require("./lambda_functions/getSubscriptionByUsernameHandler");

const app = express();
const port = 8080;

// Middleware to parse JSON request body
app.use(bodyParser.json());
app.use(cors());
// Define API endpoints
app.post("/login", loginHandler);
app.post("/register", registerHandler);
app.post("/searchMusic", searchMusicHandler);
app.post("/addSubscription", addSubscriptionHandler);
app.delete("/deleteSubscription", deleteSubscriptionHandler);
app.post("/getSubscriptionByUsername", getSubscriptionByUsernameHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
