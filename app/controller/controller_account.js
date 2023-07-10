const User = require("../models/model_account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email already exist" });
    }
    const newUser = await User.createUser({
      name: name,
      email,
      password: password,
    });
    console.log(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the input password for comparison
    const isPasswordValid = await new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    console.log("hi",password);
    console.log(user.password);

    if (!isPasswordValid) {
      console.log("try password invalid")
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {expiresIn: "1d"});

    res.status(200).json({
      message: "User logged in successfully",
      user: user,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function forgetPassword (req, res) {
  try {
    const {email} = req.body;
    const user = await User.findUserByEmail(email);
    if(!user){
      return res.status(404).json({error: "User not found"});
    }

    const temporaryPassword = randomstring.generate(10);
    const hashedTemporaryPassoword = await User.hashPassword(temporaryPassword);

    await User.updateUserPassword(user.id, hashedTemporaryPassoword);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "ayoevents12@gmail.com",
        pass: "zvtnlzqbugvqhumj",
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
        return res.status(500).json({error: "Failed to sent reset password email"});
      }
      console.log("Reset password email sent " + info.response);
      res.status(200).json({message: "Reset password email sent successfully"});
    });
  } catch(error) {
    console.error(error);
    res.status(500).json({error: "Internal server error"});
  }
}

async function updateUserPassword(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const email = decoded.email;

    const user = await User.findUserByEmail(email);
  
    const { currentPassword, newPassword } = req.body;

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    const hashedPassword = await User.hashPassword(newPassword);

    await User.updateUserPassword(user.id, hashedPassword);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user password" });
  }
}



async function logoutUser(req, res) {
  try {
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { registerUser, loginUser, forgetPassword, updateUserPassword, logoutUser };
