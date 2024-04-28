const baseUrl = "http://localhost:5005";

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("registerForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const registerForm = document.getElementById("registerForm");
      const errorMessage = document.getElementById("errorMessage");

      // Get form data
      const formData = new FormData(registerForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      const location = formData.get("location");
      const phone_number = formData.get("phone_number");

      const registerData = {
        email,
        password,
        name,
        location,
        phone_number,
      };
      const jsonData = JSON.stringify(registerData);

      fetch(`${baseUrl}/dashboarddatabase/customer/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.status === 201) {
            window.location.href = `${baseUrl}/login.html`;
          } else {
            errorMessage.textContent = data.message;
            console.error("Login failed:", data.message);
          }
        })
        .catch((error) => {
          errorMessage.textContent = data.message;
          console.error("Login failed:", data.message);
          console.error("Error logging in:", error);
        });
    });
});
