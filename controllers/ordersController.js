const db = require("../utils/database");

function createOrder(req, res) {
  const { userId, type } = req.user;

  if (type !== "customer") {
    return res
      .status(401)
      .json({ message: "Only customers can create orders" });
  }

  const { order_detail, urgency_level, order_img, location_detail } = req.body;

  const now = new Date();
  const order_date = now.toISOString().slice(0, 10).split("T")[0];
  const order_time = now.toTimeString().slice(0, 8);

  const createOrderQuery = `
    INSERT INTO ordertable (customer_id, order_date, order_time, order_status, order_detail, order_img, urgency_level, location_details, price_status)
    VALUES (${userId}, '${order_date}', '${order_time}', 'pending', '${order_detail}', '${order_img}', '${urgency_level}', '${location_detail}', 'unpaid')
  `;
  db.query(createOrderQuery, (error, result) => {
    if (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ message: "Failed to create order" });
    }

    return res
      .status(201)
      .json({ message: "Order created successfully", result });
  });
}

function declineOrder(req, res) {
  const { type } = req.user;
  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { id } = req.params;
  const declineOrderQuery = `UPDATE ordertable SET order_status='cancelled' WHERE order_id=${id}`;
  db.query(declineOrderQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    return res
      .status(201)
      .json({ message: "Order declined successfully", result: rows[0] });
  });
}

function getOrdersCountByStatus(status) {
  return `SELECT COUNT(*) AS orders_count FROM ordertable WHERE order_status = "${status}"`;
}
function pendingOrdersCount(req, res) {
  const countQuery = getOrdersCountByStatus("pending");
  db.query(countQuery, (error, results) => {
    if (error) {
      console.error("Error counting pending orders:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    res.json({ count: results[0].orders_count });
  });
}

function completedOrdersCount(req, res) {
  const countQuery = getOrdersCountByStatus("completed");
  db.query(countQuery, (error, results) => {
    if (error) {
      console.error("Error counting completed orders:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json({ count: results[0].orders_count });
  });
}

function ongoingOrdersCount(req, res) {
  const countQuery = getOrdersCountByStatus("ongoing");
  db.query(countQuery, (error, results) => {
    if (error) {
      console.error("Error counting ongoing orders:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json({ count: results[0].orders_count });
  });
}

function viewAllOrders(req, res) {
  const { status } = req.query;
  const { userId, type } = req.user;
  let viewAllOrdersQuery = "";

  if (type === "customer") {
    viewAllOrdersQuery = `SELECT * FROM ordertable WHERE customer_id=${userId}`;
  } else if (type === "technician") {
    viewAllOrdersQuery = `SELECT * FROM ordertable WHERE technician_id='${userId}'`;
  } else {
    viewAllOrdersQuery = "SELECT * FROM ordertable";
  }
  if (status && type === "admin") {
    viewAllOrdersQuery += ` WHERE order_status='${status}'`;
  } else if (status) {
    viewAllOrdersQuery += ` AND order_status='${status}'`;
  }

  db.query(viewAllOrdersQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    return res.status(200).json({ result: rows });
  });
}

function viewCompletedOrderHistory(req, res) {
  const { customer, date } = req.query;
  const { type } = req.user;

  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let viewOrderHistoryQuery = "SELECT * FROM ordertable o WHERE";

  if (customer && date) {
    viewOrderHistoryQuery = `SELECT o.*, c.name AS customer_name FROM ordertable o INNER JOIN customer c ON o.customer_id = c.customer_id WHERE c.name LIKE '%${customer}%' AND o.order_date = '${date}' AND`;
  } else if (customer) {
    viewOrderHistoryQuery = `SELECT o.*, c.name AS customer_name FROM ordertable o INNER JOIN customer c ON o.customer_id = c.customer_id WHERE c.name LIKE '%${customer}%' AND`;
  } else if (date) {
    viewOrderHistoryQuery = `SELECT o.*, c.name AS customer_name FROM ordertable o INNER JOIN customer c ON o.customer_id = c.customer_id WHERE o.order_date = '${date}' AND`;
  }

  viewOrderHistoryQuery += ` o.order_status='completed'`;
  db.query(viewOrderHistoryQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    return res.status(200).json({ result: rows });
  });
}

module.exports = {
  createOrder,
  viewAllOrders,
  pendingOrdersCount,
  completedOrdersCount,
  ongoingOrdersCount,
  declineOrder,
  viewCompletedOrderHistory,
};
