const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const connectDB = async () => {
  let db1 = process.env.MONGO_URI;
  try {
    await mongoose.connect(db1, {
      useNewUrlParser: true,
    });
    if(db1){
      console.log("MongoDB is connected to local server!");
    }
    else{

      console.log("MongoDB is connected successfully!");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
};
module.exports = connectDB;
