const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const userController = require("../controller/controller_account");

// Register User
router.post("/register",
[
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least 1 uppercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least 1 number")
      .matches(/[^A-Za-z0-9]/)
      .withMessage("Password must contain at least 1 special character"),
  ]
,userController.registerUser);

// Login User
router.post("/login", userController.loginUser);

//Forgot Password
router.post("/forgot-password", userController.forgetPassword);

module.exports = router;
