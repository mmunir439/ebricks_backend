const { generateToken } = require("../utils/jwt"); // Import the generateToken function
const cloudinary = require("../utils/cloudinary");
const { hashPassword} = require("../utils/hash");
const { sendEmail } = require('../utils/email');
const { comparePassword} = require("../utils/hash");
const User = require("../models/user");
// creating the user
exports.createUser = async (req, res) => {
  try {
    const { username, cnic, email, password, role } = req.body;

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Upload photo to Cloudinary
    let photoUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_photos", // Optional: Specify a folder in Cloudinary
      });
      photoUrl = result.secure_url; // Get the secure URL of the uploaded photo
    }

    // Save user data to the database
    const newUser = await User.create({
      username,
      cnic,
      email,
      password: hashedPassword, // Save the hashed password
      photo: photoUrl, // Save the Cloudinary URL in the database
      role,
    });
     // Send welcome email
await sendEmail(
  email,
  "Welcome to Ebricks Digital Platform",
  `
  <div style="max-width:600px;margin:auto;padding:20px;background:#f9f9f9;border-radius:8px;font-family:sans-serif;">
    <h1 style="color:#2d6cdf;text-align:center;">Welcome, ${username}!</h1>
    <p style="font-size:16px;color:#333;">Your registration on the Ebricks platform was successful.</p>
    <p style="font-size:16px;color:#333;">Ebricks is your trusted platform for managing construction projects, connecting with workers, and streamlining your building processes.</p>
    <p style="font-size:16px;color:#333;">With Ebricks, you can:</p>
    <ul style="font-size:16px;color:#333;">
      <li>Hire skilled workers for your construction needs.</li>
      <li>Track and manage your ongoing projects efficiently.</li>
      <li>Access a wide range of resources to simplify your construction journey.</li>
    </ul>
    <p style="font-size:16px;color:#333;">
      If you have any questions, feel free to contact our support team or visit 
      <a href="https://munir-portfolio-iota.vercel.app/" style="color:#2d6cdf;">our website</a>.
    </p>
    <p style="font-size:16px;color:#333;">Thank you for choosing Ebricks to build your dreams!</p>
    <div style="text-align:center;margin-top:30px;">
      <a href="https://munir-portfolio-iota.vercel.app/" style="background:#2d6cdf;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">Visit Our Website</a>
    </div>
  </div>
  `
);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};
// login user

exports.loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare passwords
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate a JWT token
    const token = generateToken({ userId: user._id, email: user.email, role: user.role, photo: user.photo });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token, // Include the token in the response
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging in user",
      error: error.message,
    });
  }
};
exports.update = async (req, res) => {
  try {
    let user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { username, cnic, email, password, role } = req.body;

    // Hash the password only if it is provided
    let hashedPassword = user.password; // Default to existing password
    if (password) {
      hashedPassword = await hashPassword(password);
    }

    // Upload photo to Cloudinary
    let photoUrl = user.photo; // Default to existing photo URL
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_photos", // Optional: Specify a folder in Cloudinary
      });
      photoUrl = result.secure_url; // Get the secure URL of the uploaded photo
    }

    // Update user fields
    user.username = username || user.username;
    user.cnic = cnic || user.cnic;
    user.email = email || user.email;
    user.password = hashedPassword; // Save the hashed password
    user.photo = photoUrl; // Save the Cloudinary URL in the database
    user.role = role || user.role;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};
exports.userinformation=async (req,res) => {
  try{
   let user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    else{
      return res.status(200).json(
        {
          success:true,
          message:"user found successfully",
          user,
        }
      )
    }
  }
   catch (error) {
    res.status(500).json({
      success: false,
      message: "Error finding user",
      error: error.message,
    });
  }
}
exports.deleteaccount=async (req,res)=> {
  try{
    let user=await User.findByIdAndDelete(req.user.userId);
    if(user){
res.status(200).json({
  success:true,
  message:"User deleted Successfully",
  user,
});
    }
    else{
      res.status(404).json({
        message:"user not found",
        success:false,
      })
    }
  }
  catch(error){
    res.status(500).json({
      success:false,
      message:"error deleting user",
      error:error.message,
    })
  }
}