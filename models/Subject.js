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
      required: [true, "Please provide a slug"],
    },
    intro: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
