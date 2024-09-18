const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getClass,
  addClass,
  editClass,
  deleteClass,
} = require("../collector/classCollector");
const uploader = require("../utils/uploader");

const classRouter = express.Router();

const upload = uploader("class");

classRouter.get("/", getClass);
classRouter.post("/", protect, upload.single("image"), addClass);
classRouter.put("/:id", protect, upload.single("image"), editClass);
classRouter.delete("/:id", protect, deleteClass);

module.exports = classRouter;
