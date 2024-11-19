const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
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
    intro: {
      type: String,
    },
    content:{
      type: String,
      required: [true, "Please provide a content"],
    }
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
