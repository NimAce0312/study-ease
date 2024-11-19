const Service = require("../models/Service");
const fs = require("fs");
const slugify = require("slugify");
const filter = require("../utils/filter");
const updateData = require("../utils/update");
const pagination = require("../utils/pagination");
const checkLoggedIn = require("../utils/checkLoggedIn");
const ErrorResponse = require("../utils/errorResponse");

const getService = async (req, res, next) => {
  try {
    // Get filter and sort parameters
    const { query, sort } = filter(req.query);

    // Get select fields
    const select = checkLoggedIn(req, res, next);

    // Find service based on query parameters
    let service = await Service.find(query).select(select).sort(sort);

    // Paginate service
    service = pagination(req.query, service);

    // Return response
    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    // Return error
    next(error);
  }
};

const addService = async (req, res, next) => {
  try {
    // Get data from request
    const { title, intro, content } = req.body;

    // Generate slug
    const slug = slugify(title, { lower: true }).replace(/[^\w\-]+/g, "");

    // Check if service already exists
    const serviceExists = await Service.findOne({ slug });
    // Return error if service already exists
    if (serviceExists) {
      return next(new ErrorResponse("Service already exists", 400));
    }

    // Get image file path from the uploaded file
    const image = req.file ? req.file.filename : null;

    // Create new service
    const newService = await Service.create({
      title,
      slug,
      intro,
      content,
      image,
    });
    await newService.save();

    // Return response
    res.status(201).json({
      success: true,
      message: "Service created",
    });
  } catch (error) {
    // Delete image if error occurs
    if (req.file) {
      fs.unlinkSync(`uploads/service/${req.file.path}`);
    }
    // Return error
    next(error);
  }
};

const editService = async (req, res, next) => {
  try {
    // Search for service by id
    const searchService = await Service.findById(req.params.id);
    // Return error if service not found
    if (!searchService) {
      return next(new ErrorResponse("Service not found", 404));
    }

    let image, oldImage;
    // Get image file path from the uploaded file
    if (req.file) {
      image = req.file.filename;
      oldImage = searchService.image;
      req.body.image = image;
    }

    // Update service data
    updateData(searchService, req.body);

    // Delete old image
    if (req.file.filename && oldImage) {
      fs.unlinkSync(`uploads/service/${oldImage}`);
    }

    // Save service
    await searchService.save();

    // Return response
    res.status(200).json({
      success: true,
      message: "Service updated",
      data: searchService,
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

const deleteService = async (req, res, next) => {
  try {
    // Search for service by id
    const searchService = await Service.findById(req.params.id);
    // Return error if service not found
    if (!searchService) {
      return next(new ErrorResponse("Service not found", 404));
    }

    // Delete service
    await searchService.deleteOne({ _id: req.params.id });

    // Delete image
    if (searchService.image) {
      fs.unlinkSync(`uploads/service/${searchService.image}`);
    }
    // Return response
    res.status(200).json({
      success: true,
      message: "Service deleted",
    });
  } catch (error) {
    // Return error
    next(error);
  }
};

module.exports = { getService, addService, editService, deleteService };
