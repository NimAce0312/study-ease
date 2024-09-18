const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const uploader = (uploadDestination) => {
  // Create storage engine
  const storage = multer.diskStorage({
    // Set destination
    destination: function (req, file, cb) {
      let destination = `./uploads/${uploadDestination}`;

      // Create directory if not exists
      fs.mkdirSync(destination, { recursive: true });

      cb(null, destination);
    },
    // Set filename
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      const randomString = crypto.randomBytes(8).toString("hex");
      const fileExt = path.extname(file.originalname);
      const uniqueFilename = `${file.fieldname}-${timestamp}-${randomString}${fileExt}`;
      cb(null, uniqueFilename);
    },
  });

  // Return multer instance
  return multer({ storage: storage });
};

module.exports = uploader;
