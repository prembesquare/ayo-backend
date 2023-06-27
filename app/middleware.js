const jwt = require('jsonwebtoken');

function jwtMiddleware(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("checking");
      console.log(err);
      console.log(decoded);
      return res.status(403).json({ error: 'Failed to authenticate token' });
    }

    req.email = decoded.email;
    next();
  });
}

module.exports = jwtMiddleware;