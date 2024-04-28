const baseUrl = "http://localhost:5005";

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("resetPasswordForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const resetPasswordForm = document.getElementById("resetPasswordForm");
      const errorMessage = document.getElementById("errorMessage");

      const formData = new FormData(resetPasswordForm);
      const password = formData.get("newPassword");

      const resetPasswordData = {
        password,
      };
      const jsonData = JSON.stringify(resetPasswordData);

      const urlSearchParams = new URLSearchParams(window.location.search);
      const email = urlSearchParams.get("email");
      const token = urlSearchParams.get("token");
      const user = urlSearchParams.get("user");

      const url = `${baseUrl}/dashboarddatabase/reset-password?email=${email}&token=${token}&user=${user}`;
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.status === 200) {
            window.location.href = `${baseUrl}/login.html`;
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
