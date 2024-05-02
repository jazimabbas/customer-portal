const baseUrl = "http://localhost:5005/dashboarddatabase"; // Update with your backend API base URL

document.addEventListener("DOMContentLoaded", function () {
  const assignTechnicianForm = document.getElementById("assignTechnicianForm");
  const errorMessage = document.getElementById("errorMessage");

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  }

  assignTechnicianForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(assignTechnicianForm);
    const orderId = window.location.search.split("=")[1];
    const technician_id = +formData.get("technician");

    const jsonData = JSON.stringify({ technician_id });

    const url = `${baseUrl}/orders/${orderId}/assign-technician`; // Update with your API endpoint

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: jsonData,
    })
      .then((response) => {
        if (response.status === 401) {
          window.location.href = "login.html";
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === 200) {
          alert("Technician assigned successfully!");
          window.location.href = "requests.html";
        } else {
          errorMessage.textContent =
            data.message || "Failed to assign technician.";
          console.error("Assign technician failed:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error assigning technician:", error);
        errorMessage.textContent =
          "An error occurred while assigning technician.";
      });
  });

  function fetchTechnicians() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      window.location.href = "login.html";
    }
    fetch(`${baseUrl}/admin/technicians?status=free`, {
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
        if (data.status === 200) {
          const selectElement = document.getElementById("technician");
          console.log(selectElement);
          data.result.forEach((technician) => {
            const option = document.createElement("option");
            option.value = `${technician.technician_id}`;
            option.textContent = `${technician.name}`;
            selectElement.appendChild(option);
          });
        } else {
          console.error("Error fetching technicians:", data.message);
        }
      });
  }
  document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

  document.getElementById("whichOrder").innerHTML = `Order Id: #000${
    window.location.search.split("=")[1]
  }`;

  fetchTechnicians();
});
