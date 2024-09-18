const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getBook,
  addBook,
  editBook,
  deleteBook,
} = require("../collector/bookCollector");
const uploader = require("../utils/uploader");

const bookRouter = express.Router();

const upload = uploader("book");

bookRouter.get("/", getBook);
bookRouter.post("/", protect, upload.single("image"), addBook);
bookRouter.put("/:id", protect, upload.single("image"), editBook);
bookRouter.delete("/:id", protect, deleteBook);

module.exports = bookRouter;
