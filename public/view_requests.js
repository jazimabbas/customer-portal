document.addEventListener("DOMContentLoaded", function () {
  const logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

  const baseURL = "http://localhost:5005/dashboarddatabase";

  function fetchRequestDetails(orderId) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      window.location.href = "login.html";
    }
    fetch(`${baseURL}/orders/${orderId}/request-detail`, {
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
        const requestDetail = document.getElementById("request_details");
        if (data.status !== 200) {
          requestDetail.innerHTML = `
              <h1>Request not found</h1>
                `;
          return;
        }
        const result = data.result;

        requestDetail.innerHTML = `<h2>Request Details</h2>
      <div class="row">
        <div class="col-md-6">
          <h4>Customer Information</h4>
          <p><strong>Name:</strong> <span class="customer-name" id="customer_name">${
            result.customer.name
          }</span></p>
          <p><strong>Address:</strong> <span class="customer-address" id="customer_address">${
            result.customer.address
          }</span></p>
        </div>
        <div class="col-md-6">
          <h4>Request Information</h4>
          <p><strong>Service No.:</strong> <span class="service_no" id="service_no">#000${
            result.orderId
          }</span></p>
          <p><strong>Problem:</strong> <span class="problem" id="problem">${
            result.problem
          }</span></p>
          <p><strong>Priority:</strong> <span class="priority" id="priority">${
            result.priority
          }</span></p>
          <p><strong>Completed on:</strong> <span class="datetime" id="datetime">${
            result?.completedOn || ""
          }</span></p>
          <p><strong>Status:</strong> <span class="status" id="status">${
            result.orderStatus
          }</span></p>
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-6">
          <h4>Technician Information</h4>
          <p><strong>Name:</strong> <span class="technician-name" id="technician_name">${
            result.technician.name
          }</span></p>
          <p><strong>Estimated Time of Arrival:</strong> <span class="ETA" id="ETA">${
            result.technician.eta
          }</span></p>
          <p><strong>Contact Number:</strong> <span class="technician-phone" id="technician_phone">${
            result.technician.contactNumber
          }</span></p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <h4>Problem Details</h4>
          <p id="description">${result.orderDetail}</p>
          <img src="${result.orderImage}" alt="${
          result.problem
        }" id="problem_image">
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-md-12 text-center" id="declineBtn-${result.orderId}">
          <a href="#" data-toggle="modal" data-target="#declineModal" ><button class="cancelbtn" >Cancel Request</button></a> 
        </div>
      </div>`;

        const declineButton = document.getElementById(
          `declineBtn-${result.orderId}`
        );
        console.log(result.orderId);
        declineButton.addEventListener("click", function () {
          document.getElementById(
            "declineOrderId"
          ).innerHTML = `#000${result.orderId}`;
          document.getElementById("declineReason").value = "";
          $("#declineModal").modal("show");
        });
      })
      .catch((error) => {
        console.error("Error fetching request details:", error);
      });
  }

  function declineRequest(id, cancel_details) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      window.location.href = "login.html";
    }
    fetch(`${baseURL}/orders/${id}/decline-request`, {
      method: "PUT",
      body: JSON.stringify({ cancel_details }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          window.location.href = "login.html";
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === 200) {
          window.location.href = "dashboard.html";
        } else {
          console.error("Decline request failed:", data.message);
        }
      });
  }

  const orderId = new URLSearchParams(window.location.search).get("id");

  const confirmDecline = document.getElementById("confirmDecline");
  confirmDecline.addEventListener("click", function () {
    const declineReason = document.getElementById("declineReason").value;
    if (declineReason.trim() === "") {
      document.getElementById("declineError").innerHTML =
        "Please enter a reason for declining the order.";
      return;
    }
    // const id = document.getElementById("declineOrderId").innerHTML.slice(4);
    document.getElementById("declineError").innerHTML = "";
    declineRequest(orderId, declineReason);
  });

  document
    .getElementById("declineReason")
    .addEventListener("input", function () {
      document.getElementById("declineError").innerHTML = "";
    });

  fetchRequestDetails(orderId);
});
