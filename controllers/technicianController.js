const db = require("../utils/database");
const { generateToken } = require("../utils/authGuard");

function technicianLogin(req, res) {
  const { email, password } = req.body;

  const isTechnicianExistQuery = `SELECT * FROM technician WHERE email="${email}" AND password="${password}"`;

  // Find user in database by username and password
  db.query(isTechnicianExistQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken({
      userId: rows[0].admin_id,
      email,
      type: "technician",
    });
    // Respond with success message
    return res
      .status(200)
      .json({ message: "Login successful", result: rows[0], token });
  });
}

module.exports = { technicianLogin };
