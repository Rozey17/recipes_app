const auth = require("./authController");
const userController = require("./userController");
const express = require("express");
const router = express.Router();

router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.get("/me", auth.protect, userController.getMe);
router.post("/logout", auth.protect, userController.logout);
router.post("/logoutAll", auth.protect, userController.logoutAll);

module.exports = router;
