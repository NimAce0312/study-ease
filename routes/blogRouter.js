const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getBlog,
  addBlog,
  editBlog,
  deleteBlog,
} = require("../collector/blogCollector");
const uploader = require("../utils/uploader");

const blogRouter = express.Router();

const upload = uploader("blog");

blogRouter.get("/", getBlog);
blogRouter.post("/", protect, upload.single("image"), addBlog);
blogRouter.put("/:id", protect, upload.single("image"), editBlog);
blogRouter.delete("/:id", protect, deleteBlog);

module.exports = blogRouter;
