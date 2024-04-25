const db = require("../utils/database");

function createOrder(req, res) {
  const { userId, type } = req.user;
  if (type !== "customer") {
    return res.status(401).json({ message: "Only customer can create order" });
  }
  const {
    order_date,
    order_time,
    order_detail,
    order_img,
    urgency_level,
    location_details,
  } = req.body;

  const createOrderQuery = `INSERT INTO order (customer_id, order_date, order_time, order_status, order_detail, order_img, order_done_img, urgency_level, technician_id, cancel_details, location_details, price_details, price_status)
                      VALUES (${userId}, '${order_date}', '${order_time}', 'pending', '${order_detail}', '${order_img}', NULL, '${urgency_level}', NULL, NULL '${location_details}', NULL, "unpaid")`;

  db.query(createOrderQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    return res
      .status(201)
      .json({ message: "Order created successfully", result: rows[0] });
  });
}

function viewAllOrders(req, res) {
  const { userId, type } = req.user;
  let viewAllOrdersQuery = ``;

  if (type === "customer") {
    viewAllOrdersQuery = `SELECT * FROM order WHERE customer_id= '${userId}'`;
  } else if (type === "technician") {
    viewAllOrdersQuery = `SELECT * FROM order WHERE technician_id= '${userId}'`;
  } else {
    viewAllOrdersQuery = `SELECT * FROM order`;
  }

  db.query(viewAllOrdersQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    return res.status(200).json({ result: rows });
  });
}

module.exports = { createOrder, viewAllOrders };
