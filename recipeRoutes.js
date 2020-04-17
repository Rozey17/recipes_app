const express = require("express");
const router = express.Router();
const recipeController = require("./recipeControllers");
const auth = require("./authController");
router.post("/", auth.protect, recipeController.createRecipe);
router.get("/", auth.protect, recipeController.getAll);
router.get("/:id", auth.protect, recipeController.getById);
router.patch("/:id", auth.protect, recipeController.update);

module.exports = router;
