document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("errorMessage");

    // Get form data
    const formData = new FormData(loginForm);
    const userType = formData.get("role");
    const email = formData.get("email");
    const password = formData.get("password");

    // Create a JavaScript object with login data
    const loginData = {
      email,
      password,
      userType,
    };

    // Convert object to JSON string
    const jsonData = JSON.stringify(loginData);

    fetch("http://localhost:5005/dashboarddatabase/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the Content-Type header
      },
      body: jsonData, // Send the JSON data in the body
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 200 && data.token) {
          localStorage.setItem("token", data.token);

          let redirectUrl = "";
          if (userType === "admin") {
            redirectUrl = "dashboard.html";
          } else if (userType === "customer") {
            redirectUrl = "customer_dashboard.html";
          } else if (userType === "technician") {
            redirectUrl = "technician_dashboard.html";
          }
          window.location.href = redirectUrl;
        } else {
          // Handle failed login
          errorMessage.textContent = data.message;
          console.error("Login failed:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  });
});
