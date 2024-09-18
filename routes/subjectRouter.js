const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getSubject,
  addSubject,
  editSubject,
  deleteSubject,
} = require("../collector/subjectCollector");
const uploader = require("../utils/uploader");

const subjectRouter = express.Router();

const upload = uploader("subject");

subjectRouter.get("/", getSubject);
subjectRouter.post("/", protect, upload.single("image"), addSubject);
subjectRouter.put("/:id", protect, upload.single("image"), editSubject);
subjectRouter.delete("/:id", protect, deleteSubject);

module.exports = subjectRouter;
