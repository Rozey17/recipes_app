const express = require("express");
const router = express.Router();
const recipeController = require("./recipeControllers");

router.post("/", recipeController.createRecipe);
router.get("/", recipeController.getAll);
router.get("/:id", recipeController.getById);
router.patch("/:id", recipeController.update);

module.exports = router;
