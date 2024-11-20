const Subject = require("../models/Subject");
const fs = require("fs");
const slugify = require("slugify");
const filter = require("../utils/filter");
const updateData = require("../utils/update");
const pagination = require("../utils/pagination");
const checkLoggedIn = require("../utils/checkLoggedIn");
const ErrorResponse = require("../utils/errorResponse");

const getSubject = async (req, res, next) => {
  try {
    // Get filter and sort parameters
    const { query, sort } = filter(req.query);

    // Get select fields
    const select = checkLoggedIn(req, res, next);

    // Find subject based on query parameters
    let subject = await Subject.find(query).select(select).sort(sort);

    // Paginate subject
    subject = pagination(req.query, subject);

    // Return response
    res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    // Return error
    next(error);
  }
};

const addSubject = async (req, res, next) => {
  try {
    // Get data from request
    const { classId, title, intro } = req.body;

    // Generate slug
    const slug = slugify(title, { lower: true }).replace(/[^\w\-]+/g, "");

    // Check if subject already exists
    const subjectExists = await Subject.findOne({ slug });
    // Return error if subject already exists
    if (subjectExists) {
      return next(new ErrorResponse("Subject already exists", 400));
    }

    // Get image file path from the uploaded file
    const image = req.file ? req.file.filename : null;

    // Create new subject
    const newSubject = await Subject.create({
      classId,
      title,
      slug,
      intro,
      image,
    });
    await newSubject.save();

    // Return response
    res.status(201).json({
      success: true,
      message: "Subject created",
      data: newSubject,
    });
  } catch (error) {
    // Delete image if error occurs
    if (req.file) {
      fs.unlinkSync(`uploads/subject/${req.file.path}`);
    }
    // Return error
    next(error);
  }
};

const editSubject = async (req, res, next) => {
  try {
    // Search for subject by id
    const searchSubject = await Subject.findById(req.params.id);
    // Return error if subject not found
    if (!searchSubject) {
      return next(new ErrorResponse("Subject not found", 404));
    }

    let image, oldImage;
    // Get image file path from the uploaded file
    if (req.file) {
      image = req.file.filename;
      oldImage = searchSubject.image;
      req.body.image = image;
    }

    // Update subject data
    updateData(searchSubject, req.body);

    // Delete old image
    if (req.file.filename && oldImage) {
      fs.unlinkSync(`uploads/subject/${oldImage}`);
    }

    // Save subject
    await searchSubject.save();

    // Return response
    res.status(200).json({
      success: true,
      message: "Subject updated",
      data: searchSubject,
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

const deleteSubject = async (req, res, next) => {
  try {
    // Search for subject by id
    const searchSubject = await Subject.findById(req.params.id);
    // Return error if subject not found
    if (!searchSubject) {
      return next(new ErrorResponse("Subject not found", 404));
    }

    // Delete subject
    await searchSubject.deleteOne({ _id: req.params.id });

    // Delete image
    if (searchSubject.image) {
      fs.unlinkSync(`uploads/subject/${searchSubject.image}`);
    }
    // Return response
    res.status(200).json({
      success: true,
      message: "Subject deleted",
    });
  } catch (error) {
    // Return error
    next(error);
  }
};

module.exports = { getSubject, addSubject, editSubject, deleteSubject };
