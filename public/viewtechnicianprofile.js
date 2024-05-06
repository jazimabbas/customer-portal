const baseURL = "http://localhost:5005/dashboarddatabase";

document.addEventListener("DOMContentLoaded", function () {
  const logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

  function fetchTechnicianDetails(technicianId) {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!token) {
      console.error("No token found in local storage");
      window.location.href = "login.html";
    }
    fetch(`${baseURL}/admin/technicians/${technicianId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`, // Include token in Authorization header
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch technicain details");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status === 401) {
          window.location.href = "unauthorize_response.html";
        } else if (data.status === 200) {
          const technician = data.technician[0];
          document.querySelector(".technician-name").textContent =
            technician.name;
          document.querySelector(".technician-status").textContent =
            technician.status;
          document.querySelector(".technician-email").textContent =
            technician.email;
          document.querySelector(".technician-phone").textContent =
            technician.phone_number;
          document.querySelector(".technician-job").textContent =
            technician.specialization;
          document.querySelector(".technician-location").textContent =
            technician.location;
        } else {
          console.error("Error fetching technician details:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching technician details:", error);
      });
  }
  const urlParams = new URLSearchParams(window.location.search);
  const technicianID = urlParams.get("id");

  if (technicianID) {
    fetchTechnicianDetails(technicianID);
  } else {
    console.error("technician ID not found in URL");
  }
});
