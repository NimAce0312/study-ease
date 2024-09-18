const mongoose = require("mongoose");

const SubscribeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email"],
    unique: true,
  },
});

const Subscribe = mongoose.model("Subscribe", SubscribeSchema);

module.exports = Subscribe;
