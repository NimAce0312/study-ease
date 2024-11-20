const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.ObjectId,
      ref: "Subject",
      required: [true, "Please provide a subject"],
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
    content: {
      type: String,
      required: [true, "Please provide a content"],
    },
  },
  {
    timestamps: true,
  }
);

const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = Chapter;
