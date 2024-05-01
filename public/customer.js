document.addEventListener("DOMContentLoaded", function () {
  const baseURL = "http://localhost:5005/dashboarddatabase"; // Base URL for API requests

  function fetchCustomerById(customerId) {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!token) {
      console.error("No token found in local storage");
      return Promise.reject(new Error("No token found in local storage"));
    }

    return fetch(`${baseURL}/admin/customers/${customerId}`, {
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
        return response.json(); // Parse response JSON and return the data
      })
      .catch((error) => {
        console.error("Error fetching customer details:", error);
        throw error; // Re-throw the error to propagate it further
      });
  }

  function fetchCustomerByIdForEdit(customerId) {
    return fetchCustomerById(customerId)
      .then((data) => {
        const customer = data.data;
        const editModal = document.getElementById("edit-modal");

        editModal.querySelector(".name").value = customer.name;
        editModal.querySelector(".email").value = customer.email;
        editModal.querySelector(".location").value = customer.location;
        editModal.querySelector(".alarm-brand").value = customer.alarm_brand;
        editModal.querySelector(".autogate-brand").value =
          customer.autogate_brand;

        // Show the edit modal
        $("#edit-modal").modal("show");

        const editProfileBtn = document.getElementById("save-changes");
        editProfileBtn.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            const data = fetchUpdateFormData();
            console.log(data);
            updateCustomerById(customerId, data);
          },
          { once: true }
        );
      })
      .catch((error) => {
        console.error("Error fetching customer details for edit:", error);
        throw error; // Re-throw the error to propagate it further
      });
  }

  function fetchCustomerByIdForDelete(customerId) {
    return fetchCustomerById(customerId)
      .then((data) => {
        const customer = data.data;
        const deleteModal = document.getElementById("delete-modal");
        const customerNameElement = deleteModal.querySelector(".customer-name");
        const customerAddressElement =
          deleteModal.querySelector(".customer-address");
        const customerEmailElement =
          deleteModal.querySelector(".customer-email");
        const customerPhoneElement =
          deleteModal.querySelector(".customer_phone");
        console.log(customerPhoneElement);
        customerNameElement.textContent = customer.name;
        customerAddressElement.textContent = customer.location;
        customerEmailElement.textContent = customer.email;
        customerPhoneElement.textContent = customer.phone_number;
        // Show the delete modal
        $("#delete-modal").modal("show");
        // Add event listener to the delete button in modal
        const deleteProfileBtn = deleteModal.querySelector(".deletebtn");
        deleteProfileBtn.addEventListener("click", () => {
          confirmDeleteCustomer(customerId);
        });
      })
      .catch((error) => {
        console.error("Error fetching customer details for deletion:", error);
      });
  }
  // Function to fetch and display customer data

  function fetchCustomers() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }
    fetch(`${baseURL}/admin/customers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 401) {
          window.location.href = "unauthorize_response.html";
        } else if (data.status === 200) {
          const customerDetails = document.getElementById("customer-details");
          customerDetails.innerHTML = ""; // Clear existing table rows
          console.log(data.data);
          data.data.forEach((customer) => {
            const row = `
                    <tr>
                        <td>#000${customer.customer_id}</td>
                        <td>${customer.name}</td>
                        <td>${customer.email}</td>
                        <td class="text-center" style="width: 15%;"><a href="viewcustomerprofile.html?id=${customer.customer_id}"><button type="button" class="vedbtns">View</button></a></td>
                        <td class="text-center" style="width: 15%;"><button class="vedbtns edit-btn" data-toggle="modal" data-target="#edit-modal" data-customer-id="${customer.customer_id}" id="edit-btn-${customer.customer_id}">Edit</button></td>
                        <td class="text-center" style="width: 15%;"><button class="vedbtns delete-btn" data-toggle="modal" data-target="#delete-modal" data-customer-id="${customer.customer_id}" id="delete-btn-${customer.customer_id}">Delete</button></td>
                    </tr>
                `;
            customerDetails.innerHTML += row;
          });

          const editButtons = document.querySelectorAll(".edit-btn");
          editButtons.forEach((button) => {
            let editBtn = document.getElementById(button.id);
            editBtn.addEventListener("click", (event) => {
              const customerId = event.target.dataset.customerId;
              fetchCustomerByIdForEdit(customerId);
            });
          });
          const deleteButtons = document.querySelectorAll(".delete-btn");
          deleteButtons.forEach((button) => {
            let deleteBtn = document.getElementById(button.id);
            deleteBtn.addEventListener("click", (event) => {
              const customerId = event.target.dataset.customerId;
              fetchCustomerByIdForDelete(customerId);
            });
          });

          // Attach event listeners after adding table rows
        } else {
          console.error("Login failed:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching customers:", error));
  }

  // Call fetchCustomers to populate customer details initially
  fetchCustomers();

  // Function to fetch customer details by ID

  function fetchUpdateFormData() {
    const editForm = document.getElementById("editForm");

    // Get form data
    const formData = new FormData(editForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const location = formData.get("location");
    const alarm_brand = formData.get("alarm-brand") || null;
    const autogate_brand = formData.get("autogate-brand") || null;

    // Create a JavaScript object with login data
    const editFormData = {
      email,
      name,
      location,
      alarm_brand,
      autogate_brand,
    };

    return editFormData;
  }
  function updateCustomerById(customerId, updatedCustomerData) {
    console.log("customer Id", customerId);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      window.location.href = "login.html";
    }
    fetch(`${baseURL}/admin/customers/${customerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(updatedCustomerData),
    })
      .then((response) => {
        console.log(response);

        if (!response.ok) {
          throw new Error("Failed to update customer details");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === 401) {
          window.location.href = "unauthorize_response.html";
        } else if (data.status === 200) {
          console.log("Customer details updated successfully");
          $("#edit-modal").modal("hide"); // Hide edit modal
          fetchCustomers(); // Refresh customer list
        } else {
          console.error("Login failed:", data.message);
        }
      })
      .catch((error) =>
        console.error("Error updating customer details:", error)
      );
  }

  // Function to confirm and delete customer
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

  fetchCustomers();
});
