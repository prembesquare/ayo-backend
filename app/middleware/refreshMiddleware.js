const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('../Utils/utils');

function jwtRefreshMiddleware(req, res, next) {
  const refreshToken = req.headers.authorization.split(" ")[1];

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("Checking refresh token");
      console.log(err);
      console.log(decoded);
      return res.status(403).json({ error: 'Failed to authenticate refresh token' });
    }

    // Generate a new access token using the refresh token
    const accessToken = generateAccessToken(decoded.email);

    // Send the new access token in the response
    res.status(200).json({ accessToken });
  });
}

module.exports = jwtRefreshMiddleware;
