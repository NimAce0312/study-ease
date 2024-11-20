const Blog = require("../models/Blog");
const fs = require("fs");
const slugify = require("slugify");
const filter = require("../utils/filter");
const updateData = require("../utils/update");
const pagination = require("../utils/pagination");
const checkLoggedIn = require("../utils/checkLoggedIn");
const ErrorResponse = require("../utils/errorResponse");

const getBlog = async (req, res, next) => {
  try {
    // Get filter and sort parameters
    const { query, sort } = filter(req.query);

    // Get select fields
    const select = checkLoggedIn(req, res, next);

    // Find blog based on query parameters
    let blog = await Blog.find(query).select(select).sort(sort);

    // Paginate blog
    blog = pagination(req.query, blog);

    // Return response
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    // Return error
    next(error);
  }
};

const addBlog = async (req, res, next) => {
  try {
    // Get data from request
    const { title, intro, content } = req.body;

    // Generate slug
    const slug = slugify(title, { lower: true }).replace(/[^\w\-]+/g, "");

    // Check if blog already exists
    const blogExists = await Blog.findOne({ slug });
    // Return error if blog already exists
    if (blogExists) {
      return next(new ErrorResponse("Blog already exists", 400));
    }

    // Get image file path from the uploaded file
    const image = req.file ? req.file.filename : null;

    // Create new blog
    const newBlog = await Blog.create({
      title,
      slug,
      intro,
      content,
      image,
    });
    await newBlog.save();

    // Return response
    res.status(201).json({
      success: true,
      message: "Blog created",
      data: newBlog,
    });
  } catch (error) {
    // Delete image if error occurs
    if (req.file) {
      if (fs.existsSync(`${req.file.path}`)) {
        fs.unlinkSync(`${req.file.path}`);
      }
    }
    // Return error
    next(error);
  }
};

const editBlog = async (req, res, next) => {
  try {
    // Search for blog by id
    const searchBlog = await Blog.findById(req.params.id);
    // Return error if blog not found
    if (!searchBlog) {
      return next(new ErrorResponse("Blog not found", 404));
    }

    let image, oldImage;
    // Get image file path from the uploaded file
    if (req.file) {
      image = req.file.filename;
      oldImage = searchBlog.image;
      req.body.image = image;
    }

    // Update blog data
    updateData(searchBlog, req.body);

    // Delete old image
    if (req.file && oldImage) {
      if (fs.existsSync(`uploads/blog/${oldImage}`)) {
        fs.unlinkSync(`uploads/blog/${oldImage}`);
      }
    }

    // Save blog
    await searchBlog.save();

    // Return response
    res.status(200).json({
      success: true,
      message: "Blog updated",
      data: searchBlog,
    });
  } catch (error) {
    // Delete image if error occurs
    if (req.file) {
      if (fs.existsSync(`${req.file.path}`)) {
        fs.unlinkSync(`${req.file.path}`);
      }
    }

    // Return error
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    // Search for blog by id
    const searchBlog = await Blog.findById(req.params.id);
    // Return error if blog not found
    if (!searchBlog) {
      return next(new ErrorResponse("Blog not found", 404));
    }

    // Delete blog
    await searchBlog.deleteOne({ _id: req.params.id });

    // Delete image
    if (searchBlog.image) {
      if (fs.existsSync(`uploads/blog/${searchBlog.image}`)) {
        fs.unlinkSync(`uploads/blog/${searchBlog.image}`);
      }
    }
    // Return response
    res.status(200).json({
      success: true,
      message: "Blog deleted",
    });
  } catch (error) {
    // Return error
    next(error);
  }
};

module.exports = { getBlog, addBlog, editBlog, deleteBlog };
