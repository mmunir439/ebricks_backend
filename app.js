require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./utils/cloudinary');
const connectDB = require('./utils/db');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Multer Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Cloudinary folder name
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Image upload route (up to 2 images)
app.post('/upload-images', upload.array('images', 2), (req, res) => {
  res.json({ files: req.files });
});

// Start server
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});