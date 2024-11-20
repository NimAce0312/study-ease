const Class = require("../models/Class");
const fs = require("fs");
const slugify = require("slugify");
const filter = require("../utils/filter");
const updateData = require("../utils/update");
const pagination = require("../utils/pagination");
const checkLoggedIn = require("../utils/checkLoggedIn");
const ErrorResponse = require("../utils/errorResponse");

const getClass = async (req, res, next) => {
  try {
    // Get filter and sort parameters
    const { query, sort } = filter(req.query);

    // Get select fields
    const select = checkLoggedIn(req, res, next);

    // Find class based on query parameters
    let searchClass = await Class.find(query).select(select).sort(sort);

    // Paginate class
    searchClass = pagination(req.query, searchClass);

    // Return response
    res.status(200).json({
      success: true,
      data: searchClass,
    });
  } catch (error) {
    // Return error
    next(error);
  }
};

const addClass = async (req, res, next) => {
  try {
    // Get data from request
    const { title, intro} = req.body;

    // Generate slug
    const slug = slugify(title, { lower: true }).replace(/[^\w\-]+/g, "");

    // Check if class already exists
    const classExists = await Class.findOne({ slug });
    // Return error if class already exists
    if (classExists) {
      return next(new ErrorResponse("Class already exists", 400));
    }

    // Get image file path from the uploaded file
    const image = req.file ? req.file.filename : null;

    // Create new class
    const newClass = await Class.create({
      title,
      slug,
      intro,
      image,
    });
    await newClass.save();

    // Return response
    res.status(201).json({
      success: true,
      message: "Class created",
      data: newClass,
    });
  } catch (error) {
    // Delete image if error occurs
    if (req.file) {
      fs.unlinkSync(`uploads/class/${req.file.path}`);
    }
    // Return error
    next(error);
  }
};

const editClass = async (req, res, next) => {
  try {
    // Search for class by id
    const searchClass = await Class.findById(req.params.id);
    // Return error if class not found
    if (!searchClass) {
      return next(new ErrorResponse("Class not found", 404));
    }

    let image, oldImage;
    // Get image file path from the uploaded file
    if (req.file) {
      image = req.file.filename;
      oldImage = searchClass.image;
      req.body.image = image;
    }
    

    // Update class data
    updateData(searchClass, req.body);

    // Delete old image
    if (req.file.filename && oldImage) {
      fs.unlinkSync(`uploads/class/${oldImage}`);
    }

    // Save class
    await searchClass.save();

    // Return response
    res.status(200).json({
      success: true,
      message: "Class updated",
      data: searchClass,
    });
  } catch (error) {
    // Delete image if error occurs
    if (req.file) {
      fs.unlinkSync(`${req.file.path}`);
    }

    // Return error
    next(error);
  }
};

const deleteClass = async (req, res, next) => {
  try {
    // Search for class by id
    const searchClass = await Class.findById(req.params.id);
    // Return error if class not found
    if (!searchClass) {
      return next(new ErrorResponse("Class not found", 404));
    }

    // Delete class
    await searchClass.deleteOne({ _id: req.params.id });

    // Delete image
    if (searchClass.image) {
      fs.unlinkSync(`uploads/class/${searchClass.image}`);
    }
    // Return response
    res.status(200).json({
      success: true,
      message: "Class deleted",
    });
  } catch (error) {
    // Return error
    next(error);
  }
};

module.exports = { getClass, addClass, editClass, deleteClass };
