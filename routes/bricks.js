const express = require("express");
const bricksController = require("../controller/bricks");
const upload = require("../utils/multer"); // Import Multer configuration
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isadmin");
const router = express.Router();

// Create a new brick
router.post("/createbricks", authMiddleware,isAdmin, upload.single("photo"), bricksController.createBricks);
// create all bricks
router.get("/getAllBricks", bricksController.getAllBricks);
router.delete("/deletebyid/:id",authMiddleware,isAdmin, bricksController.deletebyid);
router.put("/updatebricks/:id",authMiddleware,isAdmin, upload.single("photo"), bricksController.updatebricks);
module.exports = router;