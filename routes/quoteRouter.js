const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getQuote,
  addQuote,
  editQuote,
  deleteQuote,
} = require("../collector/quoteCollector");
const uploader = require("../utils/uploader");

const quoteRouter = express.Router();

const upload = uploader("quote");

quoteRouter.get("/", getQuote);
quoteRouter.post("/", protect, upload.single("image"), addQuote);
quoteRouter.put("/:id", protect, upload.single("image"), editQuote);
quoteRouter.delete("/:id", protect, deleteQuote);

module.exports = quoteRouter;
