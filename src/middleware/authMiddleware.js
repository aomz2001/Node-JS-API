const jwt = require("jsonwebtoken");
const secret = "pawcare-2023";

function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Unauthorized: Token expired' });
      } else {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
    }

    req.user = decodedToken; // Attach decoded user information for authorization
    next();
  });
}

module.exports = verifyToken;
