const baseURL = "http://localhost:5005/dashboarddatabase";

document.addEventListener("DOMContentLoaded", function () {
  const logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

  function fetchCustomerDetails(customerID) {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!token) {
      console.error("No token found in local storage");
      window.location.href = "login.html";
    }
    fetch(`${baseURL}/admin/customers/${customerID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`, // Include token in Authorization header
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch customer details");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === 401) {
          window.location.href = "unauthorize_response.html";
        } else if (data.status === 404) {
          //   user not found html
          console.error("Customer not found");
        } else if (data.status === 200) {
          document.querySelector(".customer-name").textContent = data.data.name;
          document.querySelector(".customer-address").textContent =
            data.data.location;
          document.querySelector(".customer-email").textContent =
            data.data.email;
          document.querySelector(".customer-phone").textContent =
            data.data.phone_number;
          document.querySelector(".autogate-brand").textContent =
            data.data.auto_gate_brand;
          document.querySelector(".autogate-warranty").textContent = "";
          document.querySelector(".alarm-brand").textContent =
            data.data.alarm_brand;
          document.querySelector(".alarm-warranty").textContent =
            data.data.warranty;
        } else {
          console.error("Error fetching customer details:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching customer details:", error);
      });
  }
  const urlParams = new URLSearchParams(window.location.search);
  const customerID = urlParams.get("id");

  if (customerID) {
    fetchCustomerDetails(customerID);
  } else {
    console.error("Customer ID not found in URL");
  }
});
