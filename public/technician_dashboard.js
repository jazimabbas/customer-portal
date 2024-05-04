document.addEventListener("DOMContentLoaded", function () {
  const baseURL = "http://localhost:5005/dashboarddatabase";

  function fetchOrders(status) {
    let url = `${baseURL}/orders`;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      window.location.href = "login.html";
      return;
    }

    if (status) {
      url += `?status=${status}`;
    }

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === 401) {
          window.location.href = "unauthorize_response.html";
        }
        console.log(data);
        renderOrderList(data);
      })
      .catch((error) => {
        console.error("Error fetching orders list:", error);
      });
  }

  function renderOrderList(data) {
    const orderList = data.result;

    const tableItem = document.getElementById("tableItems");
    tableItem.innerHTML = "";
    if (orderList.length === 0) {
      tableItem.innerHTML = "<tr><td colspan='7'>No data available</td></tr>";
    }

    orderList.forEach((item) => {
      let renderBtn = "";
      //   if (item.order_status === "pending") {
      //     renderBtn = `
      //         <a href="order_detail.html?id=${item.order_id}&status=${item.order_status}"><button class="btn btn-primary">Accept</button></a>
      //         <a href="order_detail.html?id=${item.order_id}&status=${item.order_status}"><button class="btn btn-primary">Decline</button></a>
      //         `;
      //   } else if (item.order_status === "ongoing") {
      //     renderBtn = `
      //         <a href="order_detail.html?id=${item.order_id}&status=${item.order_status}"><button class="btn btn-primary">Done</button></a>
      //         <a href="order_detail.html?id=${item.order_id}&status=${item.order_status}"><button class="btn btn-primary">Cancel</button></a>
      //         `;
      //   }
      tableItem.innerHTML += `
            <tr class="table-row">
              <td>${item.order_id}</td>
              <td>${
                item.problem_type[0].toUpperCase() +
                item.problem_type.substring(1)
              }</td>
              <td class="${item.urgency_level.toLowerCase()}">${
        item.urgency_level[0].toUpperCase() + item.urgency_level.substring(1)
      }</td>
              <td>${item.order_status}</td>
              <td>${item.order_detail}</td>
              <td>${item.order_date.split("T")[0]}</td>
              <td><div class="d-flex justify-content-center flex-row">
              <a href="order_detail.html?id=${item.order_id}&status=${
        item.order_status
      }" class"mr-3"><button class="btn btn-primary">View</button></a>
      ${renderBtn}
      </div></td>
            </tr>
          `;
    });
  }

  document
    .getElementById("filterButton")
    .addEventListener("click", function () {
      const status = document.getElementById("statusFilter").value;
      fetchOrders(status);
    });

  const logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

  fetchOrders();
});
