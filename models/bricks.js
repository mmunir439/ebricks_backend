const mongoose = require("mongoose");

const bricksSchema = new mongoose.Schema({
  bricksname: { type: String, required: true }, // Name of the bricks
  oneBricksPrice: { type: Number, required: true }, // Price for one brick
  deliveryPricePerKm: { type: Number, required: true, default: 100 }, // Delivery price per kilometer
  availabilitystatus: { type: String, required: true, enum: ["available", "unavailable"] }, // Availability status of bricks
  description: { type: String }, // Optional description of the bricks
  photo: { type: String, required: true }, // Optional photo URL of the bricks
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the entry was created
});

module.exports = mongoose.model("Bricks", bricksSchema);