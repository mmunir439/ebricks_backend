const express=require("express");
const dotenv = require("dotenv");
const userRoutes=require("./routes/user.js");
const connectDB=require("./utils/db.js");
// Load environment variables from .env file
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/user", userRoutes);
// Connect DB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("welcome to ebricks");
});

// Start server
app.listen(port, () => {
  console.log(`app is listerning on port: ${port}`);
});
