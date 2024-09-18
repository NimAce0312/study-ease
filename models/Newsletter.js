const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    slug: {
      type: String,
      unique: true,
      required: [true, "Please provide a slug"],
    },
    image: {
      type: String,
    },
    author: {
      type: String,
      required: [true, "Please provide a author"],
    },
    intro: {
      type: String,
    },
    content: {
      type: String,
      required: [true, "Please provide a content"],
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", newsletterSchema);

module.exports = Book;
