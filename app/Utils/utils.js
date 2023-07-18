const jwt = require('jsonwebtoken');

function generateAccessToken(email) {
  const accessToken = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "30m" });
  return accessToken;
}

function generateRefreshToken(email) {
  const refreshToken = jwt.sign({ email }, process.env.REFRESH_SECRET_KEY, { expiresIn: "5d" });
  return refreshToken;
}

module.exports = { generateAccessToken, generateRefreshToken };
