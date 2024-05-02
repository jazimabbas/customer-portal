document.addEventListener("DOMContentLoaded", function () {
  const baseURL = "http://localhost:5005/dashboarddatabase"; // Replace this with your API base URL

  function fetchPendingRequests() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      window.location.href = "login.html";
    }
    fetch(`${baseURL}/orders?status=pending`, {
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
        const result = data.result;
        console.log(result);
        const pendingList = document.getElementById("pending-list");
        pendingList.innerHTML = "";

        result.forEach((request) => {
          const accordionItem = document.createElement("div");
          accordionItem.className = "accordion-item";

          const accordionHeader = document.createElement("h2");
          accordionHeader.className = "accordion-header";
          accordionHeader.id = `heading${request.order_id}`;

          const accordionButton = document.createElement("button");
          accordionButton.className = "accordion-button collapsed";
          accordionButton.type = "button";
          accordionButton.setAttribute("data-bs-toggle", "collapse");
          accordionButton.setAttribute(
            "data-bs-target",
            `#collapse${request.order_id}`
          );
          accordionButton.setAttribute("aria-expanded", "false");
          accordionButton.setAttribute(
            "aria-controls",
            `collapse${request.order_id}`
          );
          accordionButton.innerHTML = `<div class="#">#000${request.order_id}</div>`;

          accordionHeader.appendChild(accordionButton);

          const accordionCollapse = document.createElement("div");
          accordionCollapse.className = "accordion-collapse collapse";
          accordionCollapse.id = `collapse${request.order_id}`;
          accordionCollapse.setAttribute(
            "aria-labelledby",
            `heading${request.order_id}`
          );
          accordionCollapse.setAttribute("data-bs-parent", "#pending-list");

          const accordionBody = document.createElement("div");
          accordionBody.className = "accordion-body";

          const orderDateTime = `${request.order_date.split("T")[0]}:${
            request.order_time
          }`;
          accordionBody.innerHTML = `
              <img src="${request.order_img}" class="problemPict">
              <div class="request-detail">
                <strong>Customer:</strong> <div class="customer-name">${
                  request.customer_name
                }</div><br>
                <strong>Address:</strong> <div class="customer-address">${
                  request.customer_location
                }</div><br>
                <strong>Problem:</strong> <div class="problem">${
                  request.problem_type
                }</div><br>
                <strong>Priority:</strong> <div class="priority">${
                  request.urgency_level
                }</div><br>
                <strong>Date & Time:</strong> <div class="datetime">${orderDateTime}</div><br>
                <strong>Description:</strong> <div class="description">${
                  request.order_detail
                }</div><br>
                <strong>Technician Requested:</strong> <div class="technician_request">${
                  request.technician_id ? "request" : "Not Yet"
                }</div><br>
                <a href="assign_request.html?id=${
                  request.order_id
                }" class="btn btn-primary accept-btn ml-auto">Accept</a>
                <button id="declineBtn-${
                  request.order_id
                }" class="btn btn-danger decline-btn" data-toggle="modal" data-target="#declineModal">
                Decline
              </button>
              </div>
            `;

          accordionCollapse.appendChild(accordionBody);

          accordionItem.appendChild(accordionHeader);
          accordionItem.appendChild(accordionCollapse);

          pendingList.appendChild(accordionItem);
          const declineButton = document.getElementById(
            `declineBtn-${request.order_id}`
          );
          declineButton.addEventListener("click", function () {
            document.getElementById(
              "declineOrderId"
            ).innerHTML = `#000${request.order_id}`;
            document.getElementById("declineReason").value = "";
            $("#declineModal").modal("show");
          });
        });
      })
      .catch((error) => {
        console.error("Error fetching pending requests:", error);
      });
  }

  function fetchOngoingRequests() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      window.location.href = "login.html";
    }
    fetch(`${baseURL}/orders?status=ongoing`, {
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
        return response.json();
      })
      .then((data) => {
        const result = data.result;
        const ongoingRequestContainer = document.querySelector(".ongoing-item");

        ongoingRequestContainer.innerHTML = "";
        result.forEach((request) => {
          const card = document.createElement("div");
          card.className = "card";

          const cardBody = document.createElement("div");
          cardBody.className = "card-body";

          cardBody.innerHTML = `
            <h5 class="card-title">#000${request.order_id}</h5>
            <p class="card-text">Technician: <span class="technician-name">${request.technician_name}</span></p>
            <p class="card-text">Location: <span class="technician-location">${request.customer_address}</span></p>
            <a href="view_requests.html?id=${request.order_id}" class="btn btn-primary view-details-btn ml-auto">View Details</a>
          `;

          card.appendChild(cardBody);
          ongoingRequestContainer.appendChild(card);
        });
      })
      .catch((error) => {
        console.error("Error fetching ongoing requests:", error);
      });
  }

  fetchOngoingRequests();
  fetchPendingRequests();

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
          window.location.reload();
        } else {
          console.error("Decline request failed:", data.message);
        }
      });
  }

  const confirmDecline = document.getElementById("confirmDecline");

  confirmDecline.addEventListener("click", function () {
    const declineReason = document.getElementById("declineReason").value;
    if (declineReason.trim() === "") {
      document.getElementById("declineError").innerHTML =
        "Please enter a reason for declining the order.";
      return;
    }
    const id = document.getElementById("declineOrderId").innerHTML.slice(4);
    document.getElementById("declineError").innerHTML = "";
    declineRequest(id, declineReason);
  });

  document
    .getElementById("declineReason")
    .addEventListener("input", function () {
      document.getElementById("declineError").innerHTML = "";
    });

  const logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
});
