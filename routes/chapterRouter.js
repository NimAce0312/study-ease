const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getChapter,
  addChapter,
  editChapter,
  deleteChapter,
} = require("../collector/chapterCollector");
const uploader = require("../utils/uploader");

const chapterRouter = express.Router();

const upload = uploader("company");

chapterRouter.get("/", getChapter);
chapterRouter.post("/", protect, upload.single("image"), addChapter);
chapterRouter.put("/:id", protect, upload.single("image"), editChapter);
chapterRouter.delete("/:id", protect, deleteChapter);

module.exports = chapterRouter;
