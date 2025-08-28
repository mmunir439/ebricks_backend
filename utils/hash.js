const bcrypt = require("bcrypt");

// Function to hash a password
const hashPassword = async (password) => {
  const saltRounds = 10; // Number of salt rounds
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Function to compare a plain password with a hashed password
const comparePassword = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

module.exports = { hashPassword, comparePassword };