const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Middleware for handling CORS
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// CORS headers setup
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Routes
const authRoute = require("./routes/auth");
const employeesRoute = require("./routes/employee");
const trainingRoutes = require("./routes/training");
const roleRoutes = require("./routes/roles");

// Route Middleware
app.use("/api/auth", authRoute);
app.use("/api/employees", employeesRoute);
app.use("/api/trainings", trainingRoutes);
app.use("/api/roles", roleRoutes);

// Error handling middleware
app.use((err, _req, res, _next) => {
  res
    .status(err.errorStatus || 500)
    .send(err.errorMessage || "Something went wrong at server's end!");
});

// Connect to MongoDB
connectToDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
