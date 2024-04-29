let baseUrl = "http://localhost:5005";

document.addEventListener("DOMContentLoaded", function () {
  //   fetchOrders("pending-orders", updatePendingOrders);
  //   fetchOrders("ongoing-orders", updateOngoingOrders);
  //     fetchOrders("count-orders", fetchPendingOrdersCount);

  fetchPendingOrdersCount();
  fetchOngoingOrdersCount();
  fetchCompletedOrdersCount();
});

function fetchOrders(endpoint, updateFunction) {
  fetch(`/dashboarddatabase/${endpoint}`)
    .then((response) => response.json())
    .then((data) => {
      alert(JSON.stringify(data)); // Convert the object to a string
      return data; // Return the data for the next then() block
    })
    .then((data) => updateFunction(data)) // Update the function with the data
    .catch((error) => console.error("Error fetching data:", error));
}

function fetchPendingOrdersCount() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    window.location.href = "login.html";
  }
  fetch(`${baseUrl}/dashboarddatabase/orders/pending/count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        window.location.href = "login.html";
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const pendingOrdersCount = data.count;
      console.log("Pending Orders Count:", pendingOrdersCount);
      countPendingOrders(pendingOrdersCount); // Call the function to update UI with count
    })
    .catch((error) => {
      console.error("Error fetching pending orders count:", error);
    });
}

function fetchOngoingOrdersCount() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    window.location.href = "login.html";
  }
  fetch(`${baseUrl}/dashboarddatabase/orders/ongoing/count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        window.location.href = "login.html";
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const ongoingOrdersCount = data.count;
      console.log("Ongoing Orders Count:", ongoingOrdersCount);
      countOngoingOrders(ongoingOrdersCount); // Call the function to update UI with count
    })
    .catch((error) => {
      console.error("Error fetching ongoing orders count:", error);
    });
}

function fetchCompletedOrdersCount() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    window.location.href = "login.html";
  }
  fetch(`${baseUrl}/dashboarddatabase/orders/completed/count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        window.location.href = "./login.html";
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const completedOrdersCount = data.count;
      console.log("Completed Orders Count:", completedOrdersCount);
      countCompletedOrders(completedOrdersCount); // Call the function to update UI with count
    })
    .catch((error) => {
      console.error("Error fetching completed orders count:", error);
    });
}

function countPendingOrders(count) {
  const countElement = document.getElementById("pending-count");
  countElement.textContent = count;
}

function countOngoingOrders(count) {
  const countElement = document.getElementById("ongoing-count");
  countElement.textContent = count;
}

function countCompletedOrders(count) {
  const countElement = document.getElementById("completed-count");
  countElement.textContent = count;
}

// Display Pending Orders
function updatePendingOrders(orders) {
  const container = document.querySelector(".customer-pending-list tbody");
  container.innerHTML = ""; // Clear existing entries
  orders.forEach((order) => {
    container.innerHTML += `
            <tr>
                <td>${order.order_id}</td>
                <td>${order.order_detail}</td>
                <td class="${order.urgency_level.toLowerCase()}">${
      order.urgency_level
    }</td>
                <td><button>View</button></td>
            </tr>
        `;
  });
}

// Display Ongoing Orders
function updateOngoingOrders(orders) {
  const container = document.querySelector(".customer-ongoing-list tbody");
  container.innerHTML = ""; // Clear existing entries
  orders.forEach((order) => {
    container.innerHTML += `
        <tr>
        <td>${order.order_id}</td>
        <td>${order.order_detail}</td>
        <td class="${order.urgency_level.toLowerCase()}">${
      order.urgency_level
    }</td>
        <td><button>View</button></td>
    </tr>
        `;
  });
}

// Display Technician List
// function fetchTechnician() {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     console.error("No token found");
//     window.location.href = "login.html";
//   }
//   fetch("/dashboarddatabase/admin/technician")
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       const list = document.getElementById("technician-list");
//       list.innerHTML = ""; // Clear existing entries
//       data.result.forEach((request, index) => {
//         const row = `<tr>
//                     <td>${request.technician_id}</td>
//                     <td>${request.name}</td>
//                     <td>${request.status}</td>
//                     <td>${request.ongoing_order_id}</td>
//                     <td>${request.specialization}</td>
//                     <td>${request.email}</td>
//                 </tr>`;
//         list.innerHTML += row;
//       });
//     })
//     .catch((error) => {
//       console.error("Error fetching pending orders:", error);
//     });
// }
