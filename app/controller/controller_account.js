const User = require("../models/model_account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const { generateAccessToken, generateRefreshToken } = require('../Utils/utils');
const CustomError = require('../middleware/CustomError');

async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }
    const existingUser = await User.findUserByEmail(email);
    if (existingUser.success) {
      return res.status(409).send("Email already exists");
    }
    const newUser = await User.createUser({
      name: name,
      email,
      password: password,
    });
    if (newUser.success) {
      return res.status(201).send({
        message: "User registered successfully",
        user: newUser.data.name,
        email: newUser.data.email,
      });
    } else {
      throw new CustomError(500, newUser.message);
    }
  } catch (error) {
    next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByEmail(email);
    if (!user.success) {
      return res.status(404).send(user.message);
    }

    // Hash the input password for comparison
    const isPasswordValid = await bcrypt.compare(password, user.data.password);

    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }

    // Generate access token and refresh token
    const accessToken = generateAccessToken(user.data.email);
    const refreshToken = generateRefreshToken(user.data.email);

    res.status(200).send({
      message: "User logged in successfully",
      user: user.data,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

async function forgetPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findUserByEmail(email);
    if (!user.success) {
      return res.status(404).send(user.message);
    }

    const temporaryPassword = randomstring.generate(10);
    const hashedTemporaryPassword = await User.hashPassword(temporaryPassword);

    const updateResult = await User.updateUserPassword(user.data.id, hashedTemporaryPassword);
    if (!updateResult.success) {
      throw new CustomError(500, updateResult.message);
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "ayoevents12@gmail.com",
        pass: process.env.EMAIL_KEY,
      },
    });

    const mailOptions = {
      from: "ayoevents12@gmail.com",
      to: email,
      subject: "Password Reset Request",
      text: `You have requested to reset your password. Your temporary password is: ${temporaryPassword}. Please log in and change your password immediately.`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
        throw new CustomError(500, "Failed to send reset password email");
      }
      console.log("Reset password email sent " + info.response);
      res.status(200).send({ message: "Reset password email sent successfully" });
    });
  } catch (error) {
    next(error);
  }
}

async function updateUserPassword(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const email = decoded.email;

    const user = await User.findUserByEmail(email);

    const { currentPassword, newPassword } = req.body;

    const isPasswordValid = await bcrypt.compare(currentPassword, user.data.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid current password");
    }

    const hashedPassword = await User.hashPassword(newPassword);

    const updateResult = await User.updateUserPassword(user.data.id, hashedPassword);
    if (updateResult.success) {
      return res.status(200).send({ message: "Password updated successfully" });
    } else {
      throw new CustomError(500, updateResult.message);
    }
  } catch (error) {
    next(error);
  }
}

async function logoutUser(req, res) {
  try {
    res.status(200).send({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

module.exports = { registerUser, loginUser, forgetPassword, updateUserPassword, logoutUser };