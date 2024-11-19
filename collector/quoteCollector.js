const Quote = require("../models/Quote");
const fs = require("fs");
const slugify = require("slugify");
const filter = require("../utils/filter");
const updateData = require("../utils/update");
const pagination = require("../utils/pagination");
const checkLoggedIn = require("../utils/checkLoggedIn");
const ErrorResponse = require("../utils/errorResponse");

const getQuote = async (req, res, next) => {
  try {
    // Get filter and sort parameters
    const { query, sort } = filter(req.query);

    // Get select fields
    const select = checkLoggedIn(req, res, next);

    // Find quote based on query parameters
    let quote = await Quote.find(query).select(select).sort(sort);

    // Paginate quote
    quote = pagination(req.query, quote);

    // Return response
    res.status(200).json({
      success: true,
      data: quote,
    });
  } catch (error) {
    // Return error
    next(error);
  }
};

const addQuote = async (req, res, next) => {
  try {
    // Get data from request
    const { title, by,  content } = req.body;

    // Generate slug
    const slug = slugify(title, { lower: true }).replace(/[^\w\-]+/g, "");

    // Check if quote already exists
    const quoteExists = await Quote.findOne({ slug });
    // Return error if quote already exists
    if (quoteExists) {
      return next(new ErrorResponse("Quote already exists", 400));
    }

    // Get image file path from the uploaded file
    const image = req.file ? req.file.filename : null;

    // Create new quote
    const newQuote = await Quote.create({
      title,
      slug,
      by,
      content,
      image,
    });
    await newQuote.save();

    // Return response
    res.status(201).json({
      success: true,
      message: "Quote created",
    });
  } catch (error) {
    // Delete image if error occurs
    if (req.file) {
      fs.unlinkSync(`uploads/quote/${req.file.path}`);
    }
    // Return error
    next(error);
  }
};

const editQuote = async (req, res, next) => {
  try {
    // Search for quote by id
    const searchQuote = await Quote.findById(req.params.id);
    // Return error if quote not found
    if (!searchQuote) {
      return next(new ErrorResponse("Quote not found", 404));
    }

    let image, oldImage;
    // Get image file path from the uploaded file
    if (req.file) {
      image = req.file.filename;
      oldImage = searchQuote.image;
      req.body.image = image;
    }

    // Update quote data
    updateData(searchQuote, req.body);

    // Delete old image
    if (req.file.filename && oldImage) {
      fs.unlinkSync(`uploads/quote/${oldImage}`);
    }

    // Save quote
    await searchQuote.save();

    // Return response
    res.status(200).json({
      success: true,
      message: "Quote updated",
      data: searchQuote,
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

const deleteQuote = async (req, res, next) => {
  try {
    // Search for quote by id
    const searchQuote = await Quote.findById(req.params.id);
    // Return error if quote not found
    if (!searchQuote) {
      return next(new ErrorResponse("Quote not found", 404));
    }

    // Delete quote
    await searchQuote.deleteOne({ _id: req.params.id });

    // Delete image
    if (searchQuote.image) {
      fs.unlinkSync(`uploads/quote/${searchQuote.image}`);
    }
    // Return response
    res.status(200).json({
      success: true,
      message: "Quote deleted",
    });
  } catch (error) {
    // Return error
    next(error);
  }
};

module.exports = { getQuote, addQuote, editQuote, deleteQuote };
