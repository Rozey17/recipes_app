const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.protect, authController.logout);
router.get("/", authController.protect, userController.getAll);
router.get("/:id", authController.protect, userController.getById);
router.patch("/:id", authController.protect, userController.update);

module.exports = router;
