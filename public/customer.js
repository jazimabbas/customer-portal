document.addEventListener("DOMContentLoaded", function () {
  const baseURL = "http://localhost:5005/dashboarddatabase"; // Base URL for API requests

  // Function to fetch and display customer data
  function fetchCustomers() {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!token) {
      console.error("No token found in local storage");
      return;
    }
    fetch(`${baseURL}/admin/customers`, {
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
                <td class="text-center" style="width: 15%;"><button type="button" class="vedbtns edit-btn" data-toggle="modal" data-target="#edit-modal" data-customer-id="${customer.customer_id}">Edit</button></td>
                <td class="text-center" style="width: 15%;"><button type="button" class="vedbtns delete-btn" data-toggle="modal" data-target="#delete-modal" data-customer-id="${customer.customer_id}">Delete</button></td>
              </tr>
            `;
            customerDetails.innerHTML += row;
          });
        } else {
          console.error("Login failed:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching customers:", error));
  }

  // Function to fetch customer details by ID
  function fetchCustomerById(customerId) {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!token) {
      console.error("No token found in local storage");
      return;
    }
    fetch(`${baseURL}/admin/customers/${customerId}`, {
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
        const customer = data.data;
        // Populate edit modal form fields with customer data
        document.getElementById("edit-name").value = customer.name;
        document.getElementById("edit-email").value = customer.email;
        document.getElementById("edit-location").value = customer.location;
        document.getElementById("edit-alarm-brand").value =
          customer.alarm_brand;
        document.getElementById("edit-autogate-brand").value =
          customer.autogate_brand;

        // Show the edit modal
        $("#edit-modal").modal("show");
      })
      .catch((error) =>
        console.error("Error fetching customer details:", error)
      );
  }

  function updateCustomerById(customerId, updatedCustomerData) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      return;
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
        if (!response.ok) {
          throw new Error("Failed to update customer details");
        }
        console.log("Customer details updated successfully");
        // Optionally, close the modal or update the UI after successful update
      })
      .catch((error) =>
        console.error("Error updating customer details:", error)
      );
  }

  function deleteCustomerById(customerId) {
    fetchCustomerById(customerId)
      .then((customer) => {
        const deleteModal = document.getElementById("delete-modal");
        const customerNameElement = deleteModal.querySelector(".customer-name");
        const customerAddressElement =
          deleteModal.querySelector(".customer-address");
        const customerEmailElement =
          deleteModal.querySelector(".customer-email");
        const customerPhoneElement =
          deleteModal.querySelector(".customer-phone");

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

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("edit-btn")) {
      const customerId = event.target.dataset.customerId;
      fetchCustomerById(customerId);
    }

    if (event.target.classList.contains("delete-btn")) {
      // console.log(event.target);
      event.stopPropagation();
      const customerId = event.target.dataset.customerId;
      console.log(customerId);
      deleteCustomerById(customerId);
    }
  });

  const saveChanges = document.getElementById("save-changes");
  const updateForm = document.getElementById("editForm");
  if (updateForm) {
    saveChanges.addEventListener("submit", function (event) {
      event.preventDefault();
      const customerId = document.getElementById("edit-customer-id").value;
      const updatedCustomerData = {
        name: document.getElementById("edit-name").value,
        email: document.getElementById("edit-email").value,
        location: document.getElementById("edit-location").value,
        alarm_brand: document.getElementById("edit-alarm-brand").value,
        autogate_brand: document.getElementById("edit-autogate-brand").value,
      };
      updateCustomerById(customerId, updatedCustomerData);
    });
  }
  fetchCustomers();
});
