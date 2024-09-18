const Subscribe = require("../models/Subscribe");
const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existingSubscriber = await Subscribe.findOne({
      email: email,
    });

    if (existingSubscriber) {
      return next({ message: "Already subscribed to the newsletter" });
    }

    const newSubscriber = new Subscribe({
      email: email,
    });
    
    const subscriber = await newSubscriber.save();
    res.status(201).json({ message: "Subscription Added Successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSubscribers, subscribe, unSubscribe };
