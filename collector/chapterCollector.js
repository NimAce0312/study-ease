const Chapter = require("../models/Chapter");
const fs = require("fs");
const slugify = require("slugify");
const filter = require("../utils/filter");
const updateData = require("../utils/update");
const pagination = require("../utils/pagination");
const checkLoggedIn = require("../utils/checkLoggedIn");
const ErrorResponse = require("../utils/errorResponse");

const getChapter = async (req, res, next) => {
  try {
    // Get filter and sort parameters
    const { query, sort } = filter(req.query);

    // Get select fields
    const select = checkLoggedIn(req, res, next);

    // Find chapter based on query parameters
    let chapter = await Chapter.find(query).select(select).sort(sort);

    // Paginate chapter
    chapter = pagination(req.query, chapter);

    // Return response
    res.status(200).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    // Return error
    next(error);
  }
};

const addChapter = async (req, res, next) => {
  try {
    // Get data from request
    const { subjectId, title, intro, content } = req.body;

    // Generate slug
    const slug = slugify(title, { lower: true }).replace(/[^\w\-]+/g, "");

    // Check if chapter already exists
    const chapterExists = await Chapter.findOne({ slug });
    // Return error if chapter already exists
    if (chapterExists) {
      return next(new ErrorResponse("Chapter already exists", 400));
    }

    // Get image file path from the uploaded file
    const image = req.file ? req.file.filename : null;

    // Create new chapter
    const newChapter = await Chapter.create({
      subjectId,
      title,
      slug,
      intro,
      content,
      image,
    });
    await newChapter.save();

    // Return response
    res.status(201).json({
      success: true,
      message: "Chapter created",
      data: newChapter,
    });
  } catch (error) {
    // Delete image if error occurs
    if (req.file) {
      fs.unlinkSync(`uploads/chapter/${req.file.path}`);
    }
    // Return error
    next(error);
  }
};

const editChapter = async (req, res, next) => {
  try {
    // Search for chapter by id
    const searchChapter = await Chapter.findById(req.params.id);
    // Return error if chapter not found
    if (!searchChapter) {
      return next(new ErrorResponse("Chapter not found", 404));
    }

    let image, oldImage;
    // Get image file path from the uploaded file
    if (req.file) {
      image = req.file.filename;
      oldImage = searchChapter.image;
      req.body.image = image;
    }

    // Update chapter data
    updateData(searchChapter, req.body);

    // Delete old image
    if (req.file.filename && oldImage) {
      fs.unlinkSync(`uploads/chapter/${oldImage}`);
    }

    // Save chapter
    await searchChapter.save();

    // Return response
    res.status(200).json({
      success: true,
      message: "Chapter updated",
      data: searchChapter,
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

const deleteChapter = async (req, res, next) => {
  try {
    // Search for chapter by id
    const searchChapter = await Chapter.findById(req.params.id);
    // Return error if chapter not found
    if (!searchChapter) {
      return next(new ErrorResponse("Chapter not found", 404));
    }

    // Delete chapter
    await searchChapter.deleteOne({ _id: req.params.id });

    // Delete image
    if (searchChapter.image) {
      fs.unlinkSync(`uploads/chapter/${searchChapter.image}`);
    }
    // Return response
    res.status(200).json({
      success: true,
      message: "Chapter deleted",
    });
  } catch (error) {
    // Return error
    next(error);
  }
};

module.exports = { getChapter, addChapter, editChapter, deleteChapter };
