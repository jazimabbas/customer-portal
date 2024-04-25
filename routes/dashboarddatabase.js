const express = require("express");

const {
  customerRegister,
  customerLogin,
  changePassword,
  forgotPassword,
} = require("../controllers/customerController");

const router = express.Router();

const db = require("../utils/database");
const { viewAllOrders } = require("../controllers/ordersController");
const { decodeToken } = require("../utils/authGuard");
const {
  adminLogin,
  createTechnician,
} = require("../controllers/adminController");
const { technicianLogin } = require("../controllers/technicianController");

// customer routes
router.post("/customer/register", customerRegister);
router.post("/customer/login", customerLogin);
router.post("/customer/change-password", decodeToken, changePassword);
router.post("/customer/forgot-password", decodeToken, forgotPassword);
// order routes
router.get("/orders", decodeToken, viewAllOrders);
// admin routes
router.post("/admin/login", adminLogin);
router.post("/admin/create-technician", decodeToken, createTechnician);
// technician routes
router.post("/technician/login", technicianLogin);

router.get("/pending-orders", (req, res) => {
  const pendingOrdersQuery =
    'SELECT * FROM ordertable WHERE order_status = "pending"';
  db.query(pendingOrdersQuery, (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results);
  });
});

router.get("/ongoing-orders", (req, res) => {
  const ongoingOrdersQuery =
    'SELECT * FROM ordertable WHERE order_status = "ongoing"';
  db.query(ongoingOrdersQuery, (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results);
  });
});

router.get("/technician", (req, res) => {
  const technicianQuery = "SELECT * FROM technician";
  db.query(technicianQuery, (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results);
  });
});

// Backend route to count pending orders
router.get("/dashboarddatabase/pending-orders/count", (req, res) => {
  const countQuery =
    'SELECT COUNT(*) AS pending_orders_count FROM ordertable WHERE order_status = "pending"';

  db.query(countQuery, (error, results) => {
    if (error) {
      console.error("Error counting pending orders:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const pendingOrdersCount = results[0].pending_orders_count;
    res.json({ count: pendingOrdersCount });
  });
});

module.exports = router;
