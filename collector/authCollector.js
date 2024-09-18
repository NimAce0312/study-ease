const slugify = require("slugify");

const UserCred = require("../models/UserCred");
const ErrorResponse = require("../utils/errorResponse");
// const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) {
    return next(new ErrorResponse("Please provide an email", 400));
  } else if (!password) {
    return next(new ErrorResponse("Please provide a password", 400));
  }
  try {
    const userCred = await UserCred.findOne({ email }).select("+password");

    if (!userCred) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    const isMatch = await userCred.matchPasswords(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    sendToken(userCred, 200, res);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const userCred = await UserCred.findOne({ email });
    if (!userCred) {
      return next(new ErrorResponse("Email could not be sent", 404));
    }

    const resetToken = userCred.getResetPasswordToken();

    await userCred.save();

    const resetUrl = `${process.env.CLIENT_URL}auth/reset-password/${resetToken}`;
    const message = `
        <p>Dear ${userCred.name},</p>

        <p>We have received a request to reset the password for your account associated with SolveNepal. If you did not initiate this request, please disregard this email. However, if you did request a password reset, please follow the instructions below to set a new password:</p>

        <p>1. Click on the following link to proceed with the password reset process: <a href="${resetUrl}">${resetUrl}</a></p>

        <p>2. You will be directed to a page where you can enter a new password for your account. Please choose a strong and unique password to ensure the security of your account.</p>

        <p>3. Once you have entered your new password, click on the "Reset Password" or "Submit" button to confirm the changes.</p>

        <p>Thank you for your attention to this matter.</p>

        <p>Best regards,<br>SolveNepal Team</p>
    `;

    try {
      await sendEmail({
        to: userCred.email,
        subject: "Password Reset",
        text: message,
      });
      res.status(200).json({
        success: true,
        message: "Email sent. Please check you email.",
      });
    } catch (error) {
      userCred.resetPasswordToken = undefined;
      userCred.resetPasswordExpire = undefined;
      console.log(error.message);
      await userCred.save();
      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const userCred = await UserCred.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!userCred) {
      return next(new ErrorResponse("Invalid Token", 400));
    }
    userCred.password = req.body.password;
    userCred.resetPasswordToken = undefined;
    userCred.resetPasswordExpire = undefined;

    await userCred.save();

    res.status(201).json({
      success: true,
      message: "Password Reset Success",
    });
  } catch (error) {
    next(error);
  }
};

const sendToken = async (user, statusCode, res) => {
  const userInfo = {
    name: user.name,
    email: user.email,
  };
  const token = user.getSignedToken(userInfo);
  res.status(statusCode).json({ sucess: true, token });
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
};
