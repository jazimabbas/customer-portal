const db = require("../utils/database");
const { generateToken } = require("../utils/authGuard");

function customerLogin(req, res) {
  const { email, password } = req.body;

  const isCustomerExistQuery = `SELECT * FROM customer WHERE email="${email}" AND password="${password}"`;

  // Find user in database by username and password
  db.query(isCustomerExistQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken({
      userId: rows[0].customer_id,
      email,
      type: "customer",
    });
    // Respond with success message
    return res
      .status(200)
      .json({ message: "Login successful", result: rows[0], token });
  });
}

// Register customer
function customerRegister(req, res) {
  const { email, password } = req.body;

  // Check if username already exists
  const isUserExistQuery = `SELECT * FROM customer WHERE email=${email}`;

  db.query(isUserExistQuery, (error, rows) => {
    if (error) {
      throw error;
    }

    if (rows.length > 0) {
      return res.status(400).json({ message: "email already exists" });
    }
    const createUserQuery = `INSERT INTO customer (email, password) VALUES ("${email}", "${password}")`;
    db.query(createUserQuery, (error, rows) => {
      if (error) {
        throw error;
      }
      res.status(201).json({ message: "User created successfully" });
    });
  });
}

function changePassword(req, res) {
  const { userId, type } = req.user;
  if (type !== "customer") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { oldPassword, newPassword } = req.body;
  const changePasswordQuery = `UPDATE customer SET password="${newPassword}" WHERE customer_id=${userId} AND password="${oldPassword}"`;
  db.query(changePasswordQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    return res
      .status(200)
      .json({ message: "Password changed successfully", result: rows[0] });
  });
}

function forgotPassword(req, res) {
  const { email, oldPassword, newPassword } = req.body;
  const forgotPasswordQuery = `SELECT * FROM customer WHERE email="${email}"`;
  db.query(forgotPasswordQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email" });
    }
    const changePasswordQuery = `UPDATE customer SET password="${newPassword}" WHERE email="${email}" AND password="${oldPassword}"`;
    db.query(changePasswordQuery, (error, rows) => {
      if (error) {
        throw error;
      }
      return res.status(200).json({ message: "Password sent to your email" });
    });
  });
}

module.exports = {
  customerRegister,
  customerLogin,
  changePassword,
  forgotPassword,
};
