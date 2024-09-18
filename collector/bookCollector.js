const Book = require("../models/Book");
const fs = require("fs");
const slugify = require("slugify");
const filter = require("../utils/filter");
const updateData = require("../utils/update");
const pagination = require("../utils/pagination");
const checkLoggedIn = require("../utils/checkLoggedIn");
const ErrorResponse = require("../utils/errorResponse");

const getBook = async (req, res, next) => {
  try {
    // Get filter and sort parameters
    const { query, sort } = filter(req.query);

    // Get select fields
    const select = checkLoggedIn(req, res, next);

    // Find book based on query parameters
    let book = await Book.find(query).select(select).sort(sort);

    // Paginate book
    book = pagination(req.query, book);

    // Return response
    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    // Return error
    next(error);
  }
};

const addBook = async (req, res, next) => {
  try {
    // Get data from request
    const { title, author, intro, content } = req.body;

    // Generate slug
    const slug = slugify(title, { lower: true }).replace(/[^\w\-]+/g, "");

    // Check if book already exists
    const bookExists = await Book.findOne({ slug });
    // Return error if book already exists
    if (bookExists) {
      return next(new ErrorResponse("Book already exists", 400));
    }

    // Get image file path from the uploaded file
    const image = req.file ? req.file.filename : null;

    // Create new book
    const newBook = await Book.create({
      title,
      slug,
      author,
      intro,
      content,
      image,
    });
    await newBook.save();

    // Return response
    res.status(201).json({
      success: true,
      message: "Book created",
    });
  } catch (error) {
    // Delete image if error occurs
    if (req.file) {
      fs.unlinkSync(`uploads/book/${req.file.path}`);
    }
    // Return error
    next(error);
  }
};

const editBook = async (req, res, next) => {
  try {
    // Search for book by id
    const searchBook = await Book.findById(req.params.id);
    // Return error if book not found
    if (!searchBook) {
      return next(new ErrorResponse("Book not found", 404));
    }

    let image, oldImage;
    // Get image file path from the uploaded file
    if (req.file) {
      image = req.file.path;
      oldImage = searchBook.image;
      searchBook.image = image;
    }

    // Update book data
    updateData(searchBook, req.body);

    // Delete old image
    if (req.file.filename && oldImage) {
      fs.unlinkSync(`uploads/book/${oldImage}`);
    }

    // Save book
    await searchBook.save();

    // Return response
    res.status(200).json({
      success: true,
      message: "Book updated",
    });
  } catch (error) {
    // Delete image if error occurs
    if (req.file) {
      fs.unlinkSync(`uploads/book/${req.file.path}`);
    }

    // Return error
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    // Search for book by id
    const searchBook = await Book.findById(req.params.id);
    // Return error if book not found
    if (!searchBook) {
      return next(new ErrorResponse("Book not found", 404));
    }

    // Delete book
    await searchBook.deleteOne({ _id: req.params.id });

    // Delete image
    if (searchBook.image) {
      fs.unlinkSync(`uploads/book/${searchBook.image}`);
    }
    // Return response
    res.status(200).json({
      success: true,
      message: "Book deleted",
    });
  } catch (error) {
    // Return error
    next(error);
  }
};

module.exports = { getBook, addBook, editBook, deleteBook };
