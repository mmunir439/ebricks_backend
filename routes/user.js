const userController = require("../controller/user");
const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const upload = require("../utils/multer"); // Import Multer configuration
const router = express.Router();

// Route to register a user with image upload
router.post("/register", upload.single("photo"), userController.createUser);
router.post("/login", userController.loginuser);
router.put("/update",authMiddleware,upload.single("photo"),userController.update);
router.get("/userinformation",authMiddleware,userController.userinformation);
router.delete("/deleteaccount",authMiddleware,userController.deleteaccount);
module.exports = router;