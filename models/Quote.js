const mongoose = require("mongoose");

const qutoeSchema = new mongoose.Schema(
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
    by: {
      type: String,
      required: [true, "Please provide a quote by"],
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

const Quote = mongoose.model("Quote", qutoeSchema);

module.exports = Quote;
