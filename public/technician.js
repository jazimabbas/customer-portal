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
        const technician = data.technician[0];
        const editModal = document.getElementById("edit-modal");

        editModal.querySelector(".name").value = technician.name;
        editModal.querySelector(".email").value = technician.email;
        editModal.querySelector(".phone").value = technician.phone_number;
        editModal.querySelector(".job").value = technician.specialization;

        // Show the edit modal
        $("#edit-modal").modal("show");
        const saveChangesBtn = document.getElementById("savechange");
        saveChangesBtn.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            const editFormData = getEditFormData();
            console.log(editFormData);
            updateTechnicianById(technicianId, editFormData);
          },
          { once: true }
        );
      })
      .catch((error) => {
        console.error("Error fetching technician details for edit:", error);
        throw error;
      });
  }

  function getEditFormData() {
    const editModal = document.getElementById("edit-modal");
    const name = editModal.querySelector(".name").value;
    const email = editModal.querySelector(".email").value;
    const phone_number = editModal.querySelector(".phone").value;
    const specialization = editModal.querySelector(".job").value;
    return { name, email, phone_number, specialization };
  }
  function fetchTechnicianByIdForDelete(technicianId) {
    return fetchTechnicianById(technicianId)
      .then((data) => {
        const technician = data.technician[0];
        const deleteModal = document.getElementById("delete-modal");

        deleteModal.querySelector(".technician-name").textContent =
          technician.name;
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
          confirmDeleteTechnician(technicianId);
        });
      })
      .catch((error) => {
        console.error("Error fetching technician details for deletion:", error);
      });
  }

  function updateTechnicianById(technicianId, updatedTechnicianData) {
    console.log("technician Id", technicianId);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      window.location.href = "login.html";
    }
    fetch(`${baseURL}/admin/technicians/${technicianId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(updatedTechnicianData),
    })
      .then((response) => {
        console.log(response);

        if (!response.ok) {
          throw new Error("Failed to update technician details");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === 401) {
          window.location.href = "unauthorize_response.html";
        } else if (data.status === 200) {
          console.log("Technician details updated successfully");
          $("#edit-modal").modal("hide");
          fetchTechnicians();
        } else {
          console.error("Login failed:", data.message);
        }
      })
      .catch((error) =>
        console.error("Error updating technician details:", error)
      );
  }

  function getNewTechnicianData() {
    const addModal = document.getElementById("add-modal");
    // console.log(addModal);
    const name = addModal.querySelector(".name").value;
    const email = addModal.querySelector(".email").value;
    const phone_number = addModal.querySelector(".phone").value;
    const password = addModal.querySelector(".password").value;
    const specialization = addModal.querySelector(".specialization").value;
    return { name, email, phone_number, specialization, password };
  }

  function addTechnician(newTechnicianData) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = "";
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      window.location.href = "login.html";
      return;
    }

    fetch(`${baseURL}/admin/technicians`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(newTechnicianData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === 401) {
          window.location.href = "unauthorize_response.html";
        } else if (data.status === 400) {
          errorMessage.textContent = data.message;
          console.error("Failed to add new technician:", data.message);
        } else if (data.status === 201) {
          console.log("Technician added successfully");
          $("#add-modal").modal("hide");

          fetchTechnicians();
        } else {
          console.error("Failed to add technician:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error adding technician:", error);
      });
  }

  function confirmDeleteTechnician(technicianId) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      window.location.href = "login.html";
    }
    fetch(`${baseURL}/admin/technicians/${technicianId}`, {
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
          throw new Error("Failed to delete Technician");
        }
        console.log("Customer deleted successfully");
        $("#delete-modal").modal("hide"); // Hide delete modal
        fetchTechnicians(); // Refresh Technician list
      })
      .catch((error) => {
        console.error("Error deleting technician:", error);
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

  document.getElementById("addTechnician").addEventListener("click", () => {
    const data = getNewTechnicianData();
    addTechnician(data);
  });

  const logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
});
