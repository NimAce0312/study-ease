// const { isLoggedIn } = require("../middleware/auth");

const checkLoggedIn = (req, res, next) => {
  // Select fields other than __v, createdAt, and updatedAt
  let select = "-__v -createdAt -updatedAt";

  const isLoggedIn = true;

  // If user is not logged in, exclude _id field
  // if (isLoggedIn(req, res, next)) {
  if (!isLoggedIn) {
    select += " -_id";
  }

  return select;
};

module.exports = checkLoggedIn;
