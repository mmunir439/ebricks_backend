const jwt = require("jsonwebtoken");

// Function to generate a token
const generateToken = (payload) => {
  const secretKey = process.env.JWT_SECRET; // Ensure this is set in your .env file
  const options = { expiresIn: "1h" }; // Token expires in 1 hour
  return jwt.sign(payload, secretKey, options);
};

// Function to verify a token
const verifyToken = (token) => {
  const secretKey = process.env.JWT_SECRET; // Ensure this is set in your .env file
  return jwt.verify(token, secretKey);
};

module.exports = { generateToken, verifyToken };