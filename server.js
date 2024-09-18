require("dotenv").config();
const express = require("express");
const indexRouter = require("./routes/indexRouter");
const dbConnect = require("./db/dbConnect");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");
const defaultUser = require("./utils/defaultUser");

// Initialize express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

app.use(logger);

// Route
app.use("/api", indexRouter);

// No Route Found
app.use("/", (req, res) => {
  res.send("No Route Found");
});

// Error Handler
app.use(errorHandler);

// Start Server
const start = async () => {
  try {
    // Connect to database
    const response = await dbConnect(process.env.MONGO_URI);
    if (response.error) {
      console.log(response.error);
      return;
    }
    // Run server at given port
    app.listen(process.env.SERVER_PORT, async () => {
      console.log(`Server running on port ${process.env.SERVER_PORT}`);
      console.log(`Connected to database \'${response.name}\'`);
      defaultUser();
    });
  } catch (error) {
    // Return error
    console.log(error.message);
  }
};

start();
