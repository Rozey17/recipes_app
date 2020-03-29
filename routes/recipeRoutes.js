const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const recipeController = require("../controllers/recipeControllers");

router.post("/", authController.protect, recipeController.createRecipe);
router.get("/", authController.protect, recipeController.getAll);
router.get("/:id", authController.protect, recipeController.getById);
router.patch("/:id", authController.protect, recipeController.update);

module.exports = router;
