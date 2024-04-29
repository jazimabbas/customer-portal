const db = require("../utils/database");

// Register customer done
function customerRegister(req, res) {
  const { email, password, name, phone_number, location } = req.body;

  // Check if username already exists
  const isUserExistQuery = `SELECT * FROM customer WHERE email='${email}'`;

  db.query(isUserExistQuery, (error, rows) => {
    if (error) {
      throw error;
    }

    if (rows.length > 0) {
      return res
        .status(400)
        .json({ status: 400, message: "email already exists" });
    }
    const createUserQuery = `INSERT INTO customer (email, password, name, phone_number, location) VALUES ("${email}", "${password}", "${name}", "${phone_number}", "${location}")`;
    db.query(createUserQuery, (error, rows) => {
      if (error) {
        throw error;
      }
      return res
        .status(201)
        .json({ status: 201, message: "User created successfully" });
    });
  });
}

function getAllCustomers(req, res) {
  const { type } = req.user;

  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }
  const getAllCustomersQuery = `SELECT * FROM customer`;
  db.query(getAllCustomersQuery, (error, customers) => {
    if (error) {
      throw error;
    }
    return res.status(200).json({ status: 200, data: customers });
  });
}

function getCustomerById(req, res) {
  const customerId = req.params.id;

  const { type } = req.user;

  if (type === "technician") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }

  const getCustomerQuery = `SELECT * FROM customer WHERE customer_id = ${customerId}`;
  db.query(getCustomerQuery, (error, customer) => {
    if (error) {
      throw error;
    }

    if (customer.length === 0) {
      return res
        .status(404)
        .json({ message: "Customer not found", status: 404 });
    }

    return res.status(200).json({ status: 200, data: customer[0] });
  });
}

function updateCustomer(req, res) {
  const customerId = req.params.id;
  const {
    name,
    phone_number = null,
    location,
    alarm_brand,
    autogate_brand,
  } = req.body;

  const { type } = req.user;

  if (type === "technician") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }
  let updateCustomerQuery = `UPDATE customer SET name = '${name}', location = '${location}'`;
  updateCustomerQuery = phone_number
    ? `${updateCustomerQuery}, phone_number = '${phone_number}'`
    : updateCustomerQuery;
  updateCustomerQuery = alarm_brand
    ? `${updateCustomerQuery}, alarm_brand = '${alarm_brand}'`
    : updateCustomerQuery;
  updateCustomerQuery = autogate_brand
    ? `${updateCustomerQuery}, auto_gate_brand = '${autogate_brand}'`
    : updateCustomerQuery;

  updateCustomerQuery = `${updateCustomerQuery} WHERE customer_id = ${customerId}`;
  db.query(updateCustomerQuery, (error, result) => {
    if (error) {
      throw error;
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res
      .status(200)
      .json({ message: "Customer updated successfully", status: 200 });
  });
}

function deleteCustomer(req, res) {
  const customerId = req.params.id;

  const { type } = req.user;

  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }

  const deleteCustomerQuery = `DELETE FROM customer WHERE customer_id = ${customerId}`;
  db.query(deleteCustomerQuery, (error, result) => {
    if (error) {
      throw error;
    }

    return res.status(200).json({ message: "Customer deleted successfully" });
  });
}

module.exports = {
  customerRegister,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
