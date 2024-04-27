const db = require("../utils/database");
const { generateToken } = require("../utils/authGuard");
const { sendEmail } = require("../utils/mailService");
const { v1: uuid } = require("uuid");
function login(req, res) {
  const { email, password, userType } = req.body;

  let isUserExistQuery = "";
  if (userType === "customer") {
    isUserExistQuery = `SELECT * FROM customer WHERE email="${email}" AND password="${password}"`;
  } else if (userType === "admin") {
    console.log("her");
    isUserExistQuery = `SELECT * FROM admin WHERE email="${email}" AND admin_password="${password}"`;
  } else if (userType === "technician") {
    isUserExistQuery = `SELECT * FROM technician WHERE email="${email}" AND password="${password}"`;
  }

  const userTypeIds = {
    customer: "customer_id",
    admin: "admin_id",
    technician: "technician_id",
  };
  // Find user in database by username and password
  db.query(isUserExistQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.log(rows);
    const token = generateToken({
      userId: rows[0][userTypeIds[userType]],
      email,
      type: userType,
    });
    // Respond with success message
    return res
      .status(200)
      .json({ message: "Login successful", result: rows[0], token });
  });
}

function changePassword(req, res) {
  const { userId, type } = req.user;
  const { old_password, new_password } = req.body;

  let changePasswordQuery = "";
  if (type === "customer") {
    changePasswordQuery = `UPDATE customer SET password="${new_password}" WHERE customer_id=${userId} AND password="${old_password}"`;
  } else if (type === "technician") {
    changePasswordQuery = `UPDATE technician SET password="${new_password}" WHERE technician_id="${userId}" AND password="${old_password}"`;
  }

  db.query(changePasswordQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    if (rows.affectedRows === 0) {
      return res.status(401).json({ message: "Invalid old password" });
    }
    return res
      .status(200)
      .json({ message: "Password changed successfully", result: rows[0] });
  });
}

function forgotPassword(req, res) {
  const { email, userType } = req.body;
  let forgotPasswordQuery = "";

  if (userType === "customer") {
    forgotPasswordQuery = `SELECT * FROM customer WHERE email="${email}"`;
  } else if (userType === "technician") {
    forgotPasswordQuery = `SELECT * FROM technician WHERE email="${email}"`;
  }

  db.query(forgotPasswordQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email" });
    }
    let mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: "sepadag869@buzblox.com", // email testing purpose
      subject: "Password Reset Link",
      text: `Hey, click on the link below to reset your password, http://localhost:5005/reset-password.html?user=${userType}&email=${email}&token=${uuid()}`,
    };

    sendEmail(mailOptions);
    db.query(
      `UPDATE customer SET token="${uuid()}" WHERE email="${email}"`,
      (error, rows) => {
        if (error) {
          throw error;
        }
        return res
          .status(200)
          .json({ message: "reset-password link is sent on your email" });
      }
    );
  });
}

// reset password

function resetPassword(req, res) {
  const { email, token, user } = req.query;
  const { password } = req.body;

  let resetPasswordQuery = "";
  let setTokenNullQuery = "";
  if (user === "customer") {
    resetPasswordQuery = `UPDATE customer SET password="${password}" WHERE email="${email}" AND token="${token}"`;
    setTokenNullQuery = `UPDATE customer SET token = NULL WHERE email = "${email}"`;
  } else if (user === "technician") {
    resetPasswordQuery = `UPDATE technician SET password="${password}" WHERE email="${email}" AND token="${token}"`;
    setTokenNullQuery = `UPDATE technician SET token = NULL WHERE email = "${email}"`;
  }

  db.query(resetPasswordQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    if (rows.affectedRows === 0) {
      return res.status(401).json({ message: "link expired" });
    }
    db.query(setTokenNullQuery, (error, rows) => {
      if (error) {
        throw error;
      }

      return res.status(200).json({ message: "Password changed successfully" });
    });
  });
}
module.exports = { login, changePassword, forgotPassword, resetPassword };
