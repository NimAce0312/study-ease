const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Please provide first name"],
    },
    last_name: {
      type: String,
      required: [true, "Please provide last name"],
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide a email"],
    },
    address: {
      type: String,
    },
    subject: {
      type: String,
    },
    message: {
      type: String,
      required: [true, "Please provide a message"],
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
