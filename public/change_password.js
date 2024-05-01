const baseUrl = "http://localhost:5005";

document.addEventListener("DOMContentLoaded", function () {
  const changePasswordForm = document.getElementById("changePasswordForm");
  const errorMessage = document.getElementById("errorMessage");

  // Clear error message when new password field is focused
  const newPasswordInput = document.getElementById("newPassword");
  newPasswordInput.addEventListener("focus", () => {
    errorMessage.textContent = "";
  });

  // Clear error message when confirm new password field is focused
  const confirmNewPasswordInput = document.getElementById("confirmNewPassword");
  confirmNewPasswordInput.addEventListener("focus", () => {
    errorMessage.textContent = "";
  });

  changePasswordForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(changePasswordForm);
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmNewPassword = formData.get("confirmNewPassword");

    // Validate if new password matches the confirm new password
    if (newPassword !== confirmNewPassword) {
      errorMessage.textContent = "New passwords do not match.";
      return;
    }

    const changePasswordData = {
      old_password: currentPassword,
      new_password: newPassword,
    };

    const jsonData = JSON.stringify(changePasswordData);

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      window.location.href = "login.html";
      return;
    }

    const url = `${baseUrl}/dashboarddatabase/change-password`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: jsonData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 200) {
          localStorage.removeItem("token");
          window.location.href = "login.html";
        } else {
          errorMessage.textContent = data.message;
          console.error("Password change failed:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error changing password:", error);
      });
  });
});
