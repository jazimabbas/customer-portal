const db = require("../utils/database");
const { generateToken } = require("../utils/authGuard");

function adminLogin(req, res) {
  const { email, password } = req.body;

  const isAdminExistQuery = `SELECT * FROM admin WHERE email="${email}" AND admin_password="${password}"`;

  // Find user in database by username and password
  db.query(isAdminExistQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken({
      userId: rows[0].admin_id,
      email,
      type: "admin",
    });
    // Respond with success message
    return res
      .status(200)
      .json({ message: "Login successful", result: rows[0], token });
  });
}

function createTechnician(req, res) {
  const { type } = req.user;

  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { email, name, password, specialization, phone_number } = req.body;

  // check technician exist
  const isTechnicianExist = `SELECT * FROM technician WHERE email="${email}"`;

  db.query(isTechnicianExist, (error, rows) => {
    if (error) {
      throw error;
    }

    if (rows.length > 0) {
      return res.status(400).json({ message: "email already exists" });
    }
    const createTechnicianQuery = `INSERT INTO technician (email, name, password, specialization, status, ongoing_order_id, phone_number)
          VALUES ('${email}', '${name}', '${password}', '${specialization}', 'free', NULL, '${phone_number}')`;

    db.query(createTechnicianQuery, (error, rows) => {
      if (error) {
        throw error;
      }
      return res
        .status(201)
        .json({ message: "Technician created successfully", result: rows[0] });
    });
  });
}
module.exports = { adminLogin, createTechnician };
