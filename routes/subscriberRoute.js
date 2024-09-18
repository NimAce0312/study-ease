const express = require("express");
const { subscribe } = require("../collector/subscriberCollector");

const subscribeRouter = express.Router();

subscribeRouter.post("/", subscribe);

module.exports = subscribeRouter;
