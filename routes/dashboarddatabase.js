const express = require("express");

const {
  customerRegister,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const router = express.Router();

const db = require("../utils/database");
const {
  viewAllOrders,
  createOrder,
  declineOrder,
  pendingOrdersCount,
  completedOrdersCount,
  ongoingOrdersCount,
  viewCompletedOrderHistory,
  viewRequestDetail,
} = require("../controllers/ordersController");
const { decodeToken } = require("../utils/authGuard");
const {
  login,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const {
  createTechnician,
  getAllTechnicians,
  getTechnicianById,
  updateTechnician,
  deleteTechnician,
} = require("../controllers/technicianController");
const upload = require("../utils/imgUpload");

// auth routes
router.post("/login", login);
router.post("/change-password", decodeToken, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
// customer routes
router.post("/customer/register", customerRegister);

// order routes
router.get("/orders", decodeToken, viewAllOrders);
router.post("/orders", decodeToken, upload.single("image"), createOrder);
router.get("/orders/history", decodeToken, viewCompletedOrderHistory);
router.put("/orders/:id/decline-order", decodeToken, declineOrder);
router.get("/orders/:id/request-detail", decodeToken, viewRequestDetail);
router.get("/orders/pending/count", decodeToken, pendingOrdersCount);
router.get("/orders/completed/count", decodeToken, completedOrdersCount);
router.get("/orders/ongoing/count", decodeToken, ongoingOrdersCount);
// orders/:orderId/invoice
// admin routes
router.post("/admin/technicians", decodeToken, createTechnician);
router.get("/admin/technicians", decodeToken, getAllTechnicians);
router.get("/admin/technicians/:id", decodeToken, getTechnicianById);
router.put("/admin/technicians/:id", decodeToken, updateTechnician);
router.delete("/admin/technicians/:id", decodeToken, deleteTechnician);
router.get("/admin/customers", decodeToken, getAllCustomers);
router.get("/admin/customers/:id", decodeToken, getCustomerById);
router.put("/admin/customers/:id", decodeToken, updateCustomer);
router.delete("/admin/customers/:id", decodeToken, deleteCustomer);

module.exports = router;
