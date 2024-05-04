const db = require("../utils/database");

function createOrder(req, res) {
  const { userId, type } = req.user;
  if (type !== "customer") {
    return res
      .status(401)
      .json({ message: "Only customers can create orders", status: 401 });
  }

  const { order_detail, urgency_level, location_detail, problem_type } =
    req.body;
  const order_img = req.file ? `uploads/${req.file.filename}` : null;

  const now = new Date();
  const order_date = now.toISOString().slice(0, 10).split("T")[0];
  const order_time = now.toTimeString().slice(0, 8);

  const createOrderQuery = `
    INSERT INTO ordertable (customer_id, problem_type, order_date, order_time, order_status, order_detail, order_img, urgency_level, location_details, price_status)
    VALUES (${userId}, '${problem_type}', '${order_date}', '${order_time}', 'pending', '${order_detail}', '${order_img}', '${urgency_level}', '${location_detail}', 'unpaid')
  `;
  db.query(createOrderQuery, (error, result) => {
    if (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ message: "Failed to create order" });
    }

    return res.status(201).json({ message: "Order created successfully" });
  });
}

function viewRequestDetail(req, res) {
  const { type } = req.user;
  const orderId = req.params.id;
  const status = req.query.status;
  // console.log(req.query);
  let dbQuery = "";
  if (status === "pending" || status === "cancelled") {
    console.log("inside here");
    dbQuery = `
    SELECT 
    ordertable.*,
    c.name AS customer_name,
    c.location AS customer_address,
    c.phone_number AS customer_phone_number,
    c.email as customer_email,
    c.auto_gate_brand as customer_auto_gate_brand,
    c.alarm_brand as customer_alarm_brand,
    c.warranty as customer_warranty
    FROM 
    ordertable
    JOIN 
    customer c ON ordertable.customer_id = c.customer_id
    WHERE 
    ordertable.order_id = ${orderId}
    `;
  } else {
    dbQuery = `
    SELECT 
    ordertable.*,
    c.name AS customer_name,
    c.location AS customer_address,
    c.phone_number AS customer_phone_number,
    c.email as customer_email,
    c.auto_gate_brand as customer_auto_gate_brand,
    c.alarm_brand as customer_alarm_brand,
    c.warranty as customer_warranty, 
    t.name AS technician_name,
    t.phone_number AS technician_phone_number,
    t.specialization AS technician_specialization
    FROM 
    ordertable
    JOIN 
    customer c ON ordertable.customer_id = c.customer_id
    JOIN 
    technician t ON ordertable.technician_id = t.technician_id
    WHERE 
    ordertable.order_id = ${orderId}
    `;
  }

  db.query(dbQuery, (error, results) => {
    if (error) {
      console.error("Error executing database query:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Order not found", status: 404 });
    }
    const orderDetails = {
      orderId: results[0].order_id,
      orderDate: results[0].order_date,
      orderDoneDate: results[0].order_done_date,
      orderStatus: results[0].order_status,
      orderImage: results[0].order_img,
      orderDoneImage: results[0].order_done_img,
      orderDetail: results[0].order_detail,
      priority: results[0].urgency_level,
      locationDetail: results[0].location_detail,
      priceStatus: results[0].price_status,
      totalPrice: results[0].total_price,
      problem:
        (results[0]?.technician_specialization &&
          results[0].technician_specialization[0].toUpperCase() +
            results[0].technician_specialization.substring(1)) ||
        "",
      customer: {
        name: results[0].customer_name,
        address: results[0].customer_address,
        email: results[0].customer_email,
        phone: results[0].customer_phone_number,
        autogateBrand: results[0].customer_auto_gate_brand,
        alarmBrand: results[0].customer_alarm_brand,
        warranty: results[0].customer_warranty,
      },
      technician: {
        name: results[0]?.technician_name || "",
        contactNumber: results[0]?.technician_phone_number || "",
        eta: results[0]?.technician_eta || "",
      },
      userType: type,
    };

    return res.status(200).json({ status: 200, result: orderDetails });
  });
}

function getOrderDetail(req, res) {
  const orderId = req.params.id;
  const { status: orderStatus } = req.query;

  let dbQuery = `
    SELECT 
      ordertable.*,
      c.name AS customer_name,
      c.location AS customer_address,
      c.phone_number AS customer_phone_number,
      c.email as customer_email,
      c.auto_gate_brand as customer_auto_gate_brand,
      c.alarm_brand as customer_alarm_brand,
      c.warranty as customer_warranty
    FROM 
      ordertable
    JOIN 
      customer c ON ordertable.customer_id = c.customer_id
  `;

  if (orderStatus !== "pending") {
    dbQuery += `
      JOIN 
        technician t ON ordertable.technician_id = t.technician_id
    `;
  }

  dbQuery += `
    WHERE 
      ordertable.order_id = ${orderId}
  `;

  db.query(dbQuery, (error, results) => {
    if (error) {
      console.error("Error executing database query:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Order not found", status: 404 });
    }

    const orderDetails = {
      orderId: results[0].order_id,
      orderDate: results[0].order_date,
      orderDoneDate: results[0].order_done_date,
      orderStatus: results[0].order_status,
      orderImage: results[0].order_img,
      orderDoneImage: results[0].order_done_img,
      orderDetail: results[0].order_detail,
      priority: results[0].urgency_level,
      locationDetail: results[0].location_detail,
      priceStatus: results[0].price_status,
      totalPrice: results[0].total_price,
      problem:
        (results[0]?.technician_specialization &&
          results[0].technician_specialization[0].toUpperCase() +
            results[0].technician_specialization.substring(1)) ||
        "",
      customer: {
        name: results[0].customer_name,
        address: results[0].customer_address,
        email: results[0].customer_email,
        phone: results[0].customer_phone_number,
        autogateBrand: results[0].customer_auto_gate_brand,
        alarmBrand: results[0].customer_alarm_brand,
        warranty: results[0].customer_warranty,
      },
      technician: {
        name: results[0]?.technician_name || "",
        contactNumber: results[0]?.technician_phone_number || "",
        eta: results[0]?.technician_eta || "",
      },
    };

    return res.status(200).json({ status: 200, result: orderDetails });
  });
}

function declineOrder(req, res) {
  const { type } = req.user;
  const { cancel_details } = req.body;
  if (type === "customer") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }

  const { id } = req.params;
  const declineOrderQuery = `UPDATE ordertable SET technician_id=NULL, order_status='cancelled', cancel_details='${cancel_details}' WHERE order_id='${id}'`;
  db.query(declineOrderQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    return res
      .status(200)
      .json({ message: "Order declined successfully", status: 200 });
  });
}

function assignTechnician(req, res) {
  const { type } = req.user;
  const { id } = req.params;
  const { technician_id } = req.body;
  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }
  const assignTechnicianQuery = `UPDATE ordertable SET technician_id=${technician_id} WHERE order_id=${id}`;
  db.query(assignTechnicianQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    return res
      .status(200)
      .json({ message: "Order assigned successfully", status: 200 });
  });
}
function acceptOrder(req, res) {
  const { type, userId } = req.user;
  const { id } = req.params;
  const { eta, total_amount } = req.body;

  if (type !== "technician") {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }
  const technician_eta = eta.split("T")[0];

  const acceptOrderQuery = `UPDATE ordertable SET order_status='ongoing', technician_id=${userId}, technician_eta='${technician_eta}', total_price=${total_amount} WHERE order_id=${id}`;
  db.query(acceptOrderQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    return res
      .status(200)
      .json({ message: "Order accepted successfully", status: 200 });
  });
}

function invoiceOrder(req, res) {
  const orderId = req.params.id;

  const invoiceQuery = `
  SELECT 
      o.order_id,
      o.order_date,
      o.order_status,
      o.total_price,
      o.problem_type,
      o.order_done_date,
      c.name AS customer_name,
      c.location AS customer_address,
      c.email AS customer_email,
      c.phone_number AS customer_phone_number,
      t.name AS technician_name,
      t.location AS technician_location,
      t.email AS technician_email
    FROM 
      ordertable o
      LEFT JOIN customer c ON o.customer_id = c.customer_id
      LEFT JOIN technician t ON o.technician_id = t.technician_id
    WHERE 
      o.order_id = ${orderId} AND
      o.order_status = 'completed'
  `;
  db.query(invoiceQuery, (error, results) => {
    if (error) {
      console.error("Error executing database query:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    return res.status(200).json({ status: 200, result: results[0] });
  });
}

function markOrderCompleted(req, res) {
  const orderId = req.params.id;
  const order_done_date = new Date().toISOString().split("T")[0];
  const order_img = req.file ? `uploads/${req.file.filename}` : null;
  const pricing_detail = req.body.pricing_detail;
  const updateOrderQuery = `UPDATE ordertable SET price_details = '${pricing_detail}', order_status = 'completed', order_done_date = '${order_done_date}', order_done_img = '${order_img}' WHERE order_id = ${orderId}`;
  db.query(updateOrderQuery, (error, results) => {
    if (error) {
      console.error("Error executing database query:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    return res.status(200).json({ status: 200 });
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
      res.status(500).json({ error: "Internal server error", status: 500 });
      return;
    }
    res.json({ count: results[0].orders_count, status: 200 });
  });
}

function completedOrdersCount(req, res) {
  const countQuery = getOrdersCountByStatus("completed");
  db.query(countQuery, (error, results) => {
    if (error) {
      console.error("Error counting completed orders:", error);
      res.status(500).json({ error: "Internal server error", status: 500 });
      return;
    }
    res.json({ count: results[0].orders_count, status: 200 });
  });
}

function ongoingOrdersCount(req, res) {
  const countQuery = getOrdersCountByStatus("ongoing");
  db.query(countQuery, (error, results) => {
    if (error) {
      console.error("Error counting ongoing orders:", error);
      res.status(500).json({ error: "Internal server error", status: 500 });
      return;
    }
    res.json({ count: results[0].orders_count, status: 200 });
  });
}

function pendingOrdersQuery() {
  return `SELECT o.*, c.name AS customer_name, c.email AS customer_email, c.location AS customer_location
  FROM ordertable o
  JOIN customer c ON o.customer_id = c.customer_id`;
}

function viewAllOrders(req, res) {
  const { status } = req.query;
  const { userId, type } = req.user;
  let viewAllOrdersQuery = "";

  if (type === "customer") {
    // Select orders associated with the customer and join customer information
    viewAllOrdersQuery = `
      SELECT o.*, c.name AS customer_name, c.email AS customer_email, c.location AS customer_location
      FROM ordertable o
      JOIN customer c ON o.customer_id = c.customer_id
      WHERE o.customer_id = ${userId}
    `;
  } else if (type === "technician") {
    // Select orders associated with the technician and join technician information
    viewAllOrdersQuery = `
      SELECT o.*, t.name AS technician_name,  t.email AS technician_email, t.location AS technician_location
      FROM ordertable o
      JOIN technician t ON o.technician_id = t.technician_id
      WHERE o.technician_id = ${userId}
    `;
  } else {
    // For admin users, retrieve all orders with optional status filter
    viewAllOrdersQuery = `
      SELECT o.*, c.name AS customer_name,
      c.location AS customer_address,
      c.email AS customer_email,
      c.location AS customer_location,
      t.name AS technician_name,
      t.email AS technician_email,
      t.specialization AS technician_specialization
      FROM ordertable o
      LEFT JOIN customer c ON o.customer_id = c.customer_id
      LEFT JOIN technician t ON o.technician_id = t.technician_id
    `;
  }
  if (status === "pending" && type === "admin") {
    viewAllOrdersQuery = pendingOrdersQuery();
  }
  // Append status filter if provided and user is admin or technician
  if (status && type === "admin") {
    viewAllOrdersQuery += ` WHERE o.order_status = '${status}'`;
  } else if (status) {
    viewAllOrdersQuery += ` AND o.order_status = '${status}'`;
  }

  // Execute the SQL query
  db.query(viewAllOrdersQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    return res.status(200).json({ result: rows, status: 200 });
  });
}

function viewCompletedOrderHistory(req, res) {
  let { customer, date } = req.query;
  const { type } = req.user;

  if (type !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let viewOrderHistoryQuery =
    "SELECT o.*, c.name AS customer_name FROM ordertable o INNER JOIN customer c ON o.customer_id = c.customer_id";

  if (customer && date) {
    viewOrderHistoryQuery += ` WHERE c.name LIKE '%${customer}%' AND DATE(o.order_done_date) = '${date}'`;
  } else if (customer) {
    viewOrderHistoryQuery += ` WHERE c.name LIKE '%${customer}%'`;
  } else if (date) {
    viewOrderHistoryQuery += ` WHERE DATE(o.order_done_date) = '${date}'`;
  }

  viewOrderHistoryQuery += ` AND o.order_status='completed'`;
  db.query(viewOrderHistoryQuery, (error, rows) => {
    if (error) {
      throw error;
    }
    return res.status(200).json({ result: rows, status: 200 });
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
  viewRequestDetail,
  assignTechnician,
  acceptOrder,
  getOrderDetail,
  invoiceOrder,
  markOrderCompleted,
};
