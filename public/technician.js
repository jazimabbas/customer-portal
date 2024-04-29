const baseURL = "http://localhost:5005/dashboarddatabase"; // Base URL for API requests
document.addEventListener("DOMContentLoaded", function () {
  function fetchTechnicianById(technicianId) {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!token) {
      console.error("No token found in local storage");
      window.location.href = "login.html";
    }

    return fetch(`${baseURL}/admin/technicians/${technicianId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`, // Include token in Authorization header
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch technician details");
        }
        return response.json(); // Parse response JSON and return the data
      })
      .catch((error) => {
        console.error("Error fetching technician details:", error);
        throw error;
      });
  }

  function fetchTechnicianByIdForEdit(technicianId) {
    return fetchTechnicianById(technicianId)
      .then((data) => {
        console.log(data.technician[0]);
        const technician = data.technician[0];
        const editModal = document.getElementById("edit-modal");

        editModal.querySelector(".name").value = technician.name;
        editModal.querySelector(".email").value = technician.email;
        // editModal.querySelector(".location").value = technician.location;
        editModal.querySelector(".phone").value = technician.phone_number;
        editModal.querySelector(".job").value = technician.specialization;

        // Show the edit modal
        $("#edit-modal").modal("show");
      })
      .catch((error) => {
        console.error("Error fetching technician details for edit:", error);
        throw error; // Re-throw the error to propagate it further
      });
  }

  function fetchTechnicianByIdForDelete(customerId) {
    return fetchTechnicianById(customerId)
      .then((data) => {
        const technician = data.technician[0];
        const deleteModal = document.getElementById("delete-modal");

        deleteModal.querySelector(".technician-name").textContent =
          technician.name;
        // deleteModal.querySelector(".technician-address").textContent =
        //   technician.location;
        deleteModal.querySelector(".technician-email").textContent =
          technician.email;
        deleteModal.querySelector(".technician_phone").textContent =
          technician.phone_number;
        deleteModal.querySelector(".technician_job").textContent =
          technician.specialization;

        // Show the delete modal
        $("#delete-modal").modal("show");
        // Add event listener to the delete button in modal
        const deleteProfileBtn = deleteModal.querySelector(".deletebtn");
        deleteProfileBtn.addEventListener("click", () => {
          // confirmDelete(customerId);
        });
      })
      .catch((error) => {
        console.error("Error fetching customer details for deletion:", error);
      });
  }
  function confirmDeleteCustomer(customerId) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      window.location.href = "login.html";
    }
    fetch(`${baseURL}/admin/customers/${customerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          window.location.href = "unauthorize_response.html";
        }
        if (!response.ok) {
          throw new Error("Failed to delete customer");
        }
        console.log("Customer deleted successfully");
        $("#delete-modal").modal("hide"); // Hide delete modal
        fetchCustomers(); // Refresh customer list
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
  }
  function fetchTechnicians() {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!token) {
      console.error("No token found in local storage");
      return;
    }
    fetch(`${baseURL}/admin/technicians`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`, // Include token in Authorization header
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 401) {
          window.location.href = "unauthorize_response.html";
        } else if (data.status === 200) {
          const technicianDetails =
            document.getElementById("technician-details");
          technicianDetails.innerHTML = ""; // Clear existing table rows
          console.log(data.result);
          data.result.forEach((technician) => {
            const row = `
              <tr>
                <td>#000${technician.technician_id}</td>
                <td>${technician.name}</td>
                <td>${technician.phone_number}</td>
                <td>${technician.specialization}</td>
                <td class="text-center" style="width: 15%;"><a href="viewtechnicianprofile.html?id=${technician.technician_id}"><button type="button" class="vedbtns">View</button></a></td>
                <td class="text-center" style="width: 15%;"><button type="button" class="vedbtns edit-btn" data-toggle="modal" data-target="#edit-modal" data-technician-id="${technician.technician_id}" id="edit-btn-${technician.technician_id}">Edit</button></td>
                <td class="text-center" style="width: 15%;"><button type="button" class="vedbtns delete-btn" data-toggle="modal" data-target="#delete-modal" data-technician-id="${technician.technician_id}" id="delete-btn-${technician.technician_id}">Delete</button></td>
              </tr>
            `;
            technicianDetails.innerHTML += row;
          });

          const editButtons = document.querySelectorAll(".edit-btn");
          editButtons.forEach((button) => {
            let editBtn = document.getElementById(button.id);
            editBtn.addEventListener("click", (event) => {
              const technicianId = event.target.dataset.technicianId;
              fetchTechnicianByIdForEdit(technicianId);
            });
          });
          const deleteButtons = document.querySelectorAll(".delete-btn");
          deleteButtons.forEach((button) => {
            let deleteBtn = document.getElementById(button.id);
            deleteBtn.addEventListener("click", (event) => {
              const technicianId = event.target.dataset.technicianId;
              fetchTechnicianByIdForDelete(technicianId);
            });
          });
        } else {
          console.error("Login failed:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching technicians:", error));
  }

  fetchTechnicians();
});
