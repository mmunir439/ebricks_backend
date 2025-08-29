const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Import cors
const userRoutes = require("./routes/user.js");
const bricksRoutes = require("./routes/bricks.js");
const connectDB = require("./utils/db.js");

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/user", userRoutes);
app.use("/bricks", bricksRoutes);

// Connect DB
connectDB();

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Allow requests from this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true, // Allow cookies if needed
};
app.use(cors(corsOptions)); // Use cors middleware

// Routes
app.get("/", (req, res) => {
  res.send("welcome to ebricks");
});

// Start server
app.listen(port, () => {
  console.log(`app is listening on port: ${port}`);
});