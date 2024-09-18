const mongoose = require("mongoose");

const dbConnect = async (URI) => {
  return await mongoose
    .connect(URI)
    .then((db) => {
      return { name: db.connection.name };
    })
    .catch((err) => {
      return { error: err.message };
    });
};

module.exports = dbConnect;
