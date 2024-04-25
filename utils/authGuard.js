const jwt = require("jsonwebtoken");

const secretKey = "mysecretkey";

function generateToken({ userId, email, type }) {
  return jwt.sign({ userId, email, type }, secretKey, {
    expiresIn: "5h",
  });
}

// Middleware to decode JWT token and add user information to request object
function decodeToken(req, res, next) {
  // Get token from request headers
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify token and add user information to request object
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

module.exports = { generateToken, decodeToken };
