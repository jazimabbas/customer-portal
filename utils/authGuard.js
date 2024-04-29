const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

function generateToken({ userId, email, type }) {
  return jwt.sign({ userId, email, type }, secretKey, {
    expiresIn: process.env.JWT_EXPIRY,
  });
}

function decodeToken(req, res, next) {
  // Get token from request headers
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided", status: 401 });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token", status: 401 });
    }
    req.user = decoded;
    next();
  });
}

module.exports = { generateToken, decodeToken };
