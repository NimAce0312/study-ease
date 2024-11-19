const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.ObjectId,
      ref: "Class",
      required: [true, "Please provide a class"],
    },
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    image: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      required: [true, "Please provide a slug"],
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

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
