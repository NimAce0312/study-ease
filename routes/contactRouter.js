const express = require("express");
const { protect } = require("../middleware/auth");
const { getContact, addContact } = require("../collector/contactCollector");

const contactRouter = express.Router();

contactRouter.get("/", protect, getContact);
contactRouter.post("/", addContact);

module.exports = contactRouter;
