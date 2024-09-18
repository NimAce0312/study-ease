const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const UserCred = require("../models/UserCred");

const protect = async (req, res, next) => {
  try {
    const user = await getToken(req, "protect", next);
    if (!user) {
      return next(new ErrorResponse("Invalid Token 1", 498));
    }
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse("Invalid Token 2", 498));
  }
};

const isLoggedIn = async (req, res, next) => {
  try {
    const user = await getToken(req, "check", next);
    if (!user) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return false;
  }
};

const getToken = async (req, condition, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    if (condition === "check") {
      return false;
    } else {
      return next(new ErrorResponse("Token Missing", 499));
    }
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await UserCred.findById(decoded.id);

  return user;
};

const isAdmin = (req, res, next) => {
  if (req.user.user.type !== "admin") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }
  next();
};

module.exports = {
  protect,
  isLoggedIn,
  isAdmin,
};
