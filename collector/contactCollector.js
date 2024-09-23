const Contact = require("../models/Contact");
const filter = require("../utils/filter");
const pagination = require("../utils/pagination");
const checkLoggedIn = require("../utils/checkLoggedIn");
const ErrorResponse = require("../utils/errorResponse");

const getContact = async (req, res, next) => {
  try {
    // Get filter and sort parameters
    const { query, sort } = filter(req.query);

    // Get select fields
    const select = checkLoggedIn(req, res, next);

    // Find Contact based on query parameters
    let searchContact = await Contact.find(query).select(select).sort(sort);

    // Paginate Contact
    searchContact = pagination(req.query, searchContact);

    // Return response
    res.status(200).json({
      success: true,
      data: searchContact,
    });
  } catch (error) {
    // Return error
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    // Get data from request
    const { name, email, subject, message } = req.body;

    // Check if Contact already exists
    const ContactExists = await Contact.findOne({
      name,
      email,
      subject,
      message,
    });
    // Return error if Contact already exists
    if (ContactExists) {
      return next(new ErrorResponse("Message already exists", 400));
    }

    // Create new Contact
    const newContact = await Contact.create({
      name,
      email,
      subject,
      message,
    });
    await newContact.save();

    // Return response
    res.status(201).json({
      success: true,
      message: "Contact created",
    });
  } catch (error) {
    // Return error
    next(error);
  }
};

module.exports = { getContact, addContact };
