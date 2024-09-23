const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getService,
  addService,
  editService,
  deleteService,
} = require("../collector/serviceCollector");
const uploader = require("../utils/uploader");

const serviceRouter = express.Router();

const upload = uploader("service");

serviceRouter.get("/", getService);
serviceRouter.post("/", protect, upload.single("image"), addService);
serviceRouter.put("/:id", protect, upload.single("image"), editService);
serviceRouter.delete("/:id", protect, deleteService);

module.exports = serviceRouter;
