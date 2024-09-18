const nodemailer = require("nodemailer");

const sendEmail = (options) => {
  return new Promise((resolve, reject) => {
    const trasporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.text,
    };
    trasporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error.message);
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

module.exports = sendEmail;
