const baseUrl = "http://localhost:5005";

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("forgotPasswordForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const forgotPasswordForm = document.getElementById("forgotPasswordForm");
      const errorMessage = document.getElementById("errorMessage");

      // Get form data
      const formData = new FormData(forgotPasswordForm);
      const email = formData.get("email");
      const userType = formData.get("role");

      // Create a JavaScript object with login data
      const forgotPasswordData = {
        email,
        userType,
      };

      // Convert object to JSON string
      const jsonData = JSON.stringify(forgotPasswordData);

      fetch(`${baseUrl}/dashboarddatabase/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the Content-Type header
        },
        body: jsonData, // Send the JSON data in the body
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.status === 200) {
            window.location.href = `${baseUrl}/reset_success_email_sent.html`;
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
