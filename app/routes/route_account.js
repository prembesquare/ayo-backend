const express = require("express");
const router = express.Router();
const userController = require("../controller/controller_account");

// Register User
router.post("/register", userController.registerUser);

// Login User
router.post("/login", userController.loginUser);

module.exports = router;
