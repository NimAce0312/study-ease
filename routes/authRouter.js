const express = require("express");
const multer = require("multer");
const {
  login,
  forgotPassword,
  resetPassword,
} = require("../collector/authCollector");

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/forgot_password", forgotPassword);
authRouter.put("/reset_password/:resetToken", resetPassword);

module.exports = authRouter;