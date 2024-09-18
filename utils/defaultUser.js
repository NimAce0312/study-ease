const UserCred = require("../models/UserCred");

const defaultUser = async () => {
  try {
    let userExists = await UserCred.findOne({ email: process.env.ADMIN_EMAIL });

    if (!userExists) {
      let userCredData = {
        username: process.env.ADMIN_USERNAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      };

      let userCred = new UserCred(userCredData);
      await userCred.save();

      console.log("Admin User Created");
    }
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = defaultUser;
