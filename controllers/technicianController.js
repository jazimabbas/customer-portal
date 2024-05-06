const db = require("../utils/database");

function createTechnician(req, res) {
  const { type } = req.user;

  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { email, name, password, specialization, phone_number, location } =
    req.body;

  // check technician exist
  const isTechnicianExist = `SELECT * FROM technician WHERE email="${email}"`;

  db.query(isTechnicianExist, (error, rows) => {
    if (error) {
      throw error;
    }

    if (rows.length > 0) {
      return res
        .status(400)
        .json({ message: "email already exists", status: 400 });
    }
    const createTechnicianQuery = `INSERT INTO technician (email, name, password, specialization, status, phone_number, location)
          VALUES ('${email}', '${name}', '${password}', '${specialization}', 'free', '${phone_number}', '${location}')`;

    db.query(createTechnicianQuery, (error, rows) => {
      if (error) {
        throw error;
      }
      return res.status(201).json({
        message: "Technician created successfully",
        result: rows[0],
        status: 201,
      });
    });
  });
}

function getAllTechnicians(req, res) {
  const { type } = req.user;
  const { status } = req.query;

  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }
  let dbQuery = `SELECT * FROM technician`;
  if (status === "free") {
    dbQuery += ` WHERE ongoing_order_id IS NULL`;
  }
  db.query(dbQuery, (error, rows) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error fetching technicians", status: 500 });
    }
    return res.status(200).json({ result: rows, status: 200 });
  });
}

function getTechnicianById(req, res) {
  const { type } = req.user;
  const technicianId = req.params.id;

  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }
  const query = `SELECT * FROM technician WHERE technician_id = ${technicianId}`;
  db.query(query, (error, technician) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error fetching technician", status: 500 });
    }

    return res.status(200).json({ technician: technician, status: 200 });
  });
}

function updateTechnician(req, res) {
  const { type } = req.user;
  const technicianId = req.params.id;
  const { name, specialization, phone_number, email, location } = req.body;

  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }

  const updateQuery = `UPDATE technician SET location = '${location}' , name ='${name}' , email = '${email}' , specialization = '${specialization}', phone_number = '${phone_number}' WHERE technician_id = ${technicianId}`;
  db.query(updateQuery, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating technician" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Technician not found" });
    }

    return res
      .status(200)
      .json({ message: "Technician updated successfully", status: 200 });
  });
}

function deleteTechnician(req, res) {
  const { type } = req.user;
  const technicianId = req.params.id;

  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }

  const deleteQuery = `DELETE FROM technician WHERE technician_id = ${technicianId}`;
  db.query(deleteQuery, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Error deleting technician" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Technician not found" });
    }

    return res
      .status(200)
      .json({ message: "Technician deleted successfully", status: 200 });
  });
}

module.exports = {
  createTechnician,
  getAllTechnicians,
  getTechnicianById,
  updateTechnician,
  deleteTechnician,
};
