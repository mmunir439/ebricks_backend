const mongoose = require('mongoose');
const Bricks = require('../models/bricks');
const cloudinary = require("../utils/cloudinary");
exports.createBricks = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const { bricksname, oneBricksPrice, deliveryPricePerKm, availabilitystatus, description } = req.body;

    // Upload photo to Cloudinary
    let photoUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_photos",
      });
      photoUrl = result.secure_url;
    }

    // Save bricks data to the database
    const newBrick = await Bricks.create({
      bricksname,
      oneBricksPrice,
      deliveryPricePerKm,
      availabilitystatus,
      description,
      photo: photoUrl,
    });

    res.status(201).json({
      success: true,
      message: "Bricks created successfully",
      data: newBrick,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating bricks",
      error: error.message,
    });
  }
};
exports.getAllBricks = async (req, res) => {
  try {
    const bricks = await Bricks.find();
    res.status(200).json({
      success: true,
      message: "Bricks retrieved successfully",
      data: bricks,
    });
  }
   catch (error) {
    res.status(500).json({
      success: false,
      message: "Error finding bricks",
      error: error.message,
    });
  }
}
exports.deletebyid=async(req,res)=>{
  try{
   let {id}=req.params;
   id=id.trim();
   let deltebyidbrick=await Bricks.findByIdAndDelete(id);
   if(!deltebyidbrick){
    return res.status(404).json({
      success: false,
      message: "Brick not found",
    });
   }
   else{
    res.status(200).json({
      success: true,
      message: "this brick deleted successfully",
      data: deltebyidbrick,

    }); 

  }
}
  catch(error){
    res.status(500).json({
      success: false,
      message: "Error deleting brick",
      error: error.message,
    });
  }
}
exports.updatebricks = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim(); // Ensure the ID is clean

    // Find the brick by ID
    const brick = await Bricks.findById(id);
    if (!brick) {
      return res.status(404).json({
        success: false,
        message: "Brick not found",
      });
    }

    // Handle photo upload (if provided)
    let photoUrl = brick.photo; // Default to existing photo
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bricks_photos", // Optional: Specify a folder in Cloudinary
      });
      photoUrl = result.secure_url; // Update with new photo URL
    }

    // Update the brick with new data
    const updatedBrick = await Bricks.findByIdAndUpdate(
      id,
      {
        ...req.body, // Spread the body fields
        photo: photoUrl, // Update the photo field
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      success: true,
      message: "Brick updated successfully",
      data: updatedBrick,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating brick",
      error: error.message,
    });
  }
};