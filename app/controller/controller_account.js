const User = require("../models/model_account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;
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
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
      function (err, result) {
        console.log(err, result);
      }
    );
    console.log(password);
    console.log(user.password);

    if (isPasswordValid == false) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY);

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

module.exports = { registerUser, loginUser };
