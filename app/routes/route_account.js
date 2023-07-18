const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const userController = require("../controller/controller_account");
const jwtMiddleware = require('../middleware/authMiddleware');

// Register User
router.post("/register",
[
    body("name")
      .isLength({ max: 50 })
      .withMessage("Name must be at most 50 characters long")
      .notEmpty()
      .withMessage("Name is required"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .isLength({ max: 16 })
      .withMessage("Password must be at most 16 characters long")
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

//Update Password
router.put("/update", jwtMiddleware, userController.updateUserPassword);

//Logout User
router.post("/logout", userController.logoutUser);

module.exports = router;
