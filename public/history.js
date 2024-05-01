document.addEventListener("DOMContentLoaded", function () {
  const baseURL = "http://localhost:5005/dashboarddatabase";

  function fetchRequestsHistory(customerName, date) {
    let url = `${baseURL}/orders/history`;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }

    if (customerName) {
      url += `?customer=${customerName}`;
    }
    if (date) {
      console.log(date);
      url += `${customerName ? "&" : "?"}date=${date}`;
    }

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === 401) {
          window.location.href = "unauthorize_response.html";
        }
        renderHistoryItems(data);
      })
      .catch((error) => {
        console.error("Error fetching requests history:", error);
      });
  }

  function createOrderCard(item) {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = `#000${item.order_id}`;

    const customerText = document.createElement("p");
    customerText.classList.add("card-text");
    customerText.innerHTML = `Customer: <span class="customer-name">${item.customer_name}</span>`;

    const completedDateText = document.createElement("p");
    completedDateText.classList.add("card-text");
    completedDateText.innerHTML = `Completed Date: <span class="completed-date">${
      item.order_done_date.split("T")[0]
    }</span>`;

    const viewDetailsBtn = document.createElement("a");
    viewDetailsBtn.classList.add(
      "btn",
      "btn-primary",
      "view-details-btn",
      "ml-auto"
    );
    viewDetailsBtn.textContent = "View Details";
    viewDetailsBtn.href = "view_history_detail.html?id=" + item.order_id;

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(customerText);
    cardBody.appendChild(completedDateText);
    cardBody.appendChild(viewDetailsBtn);

    card.appendChild(cardBody);

    return card;
  }

  // Function to render history items on the page
  function renderHistoryItems(data) {
    const historyData = data.result;
    console.log(historyData);
    const cardItems = document.getElementById("historyItem");
    cardItems.innerHTML = `<h3>No history found</h3>`;

    historyData.forEach((item) => {
      cardItems.appendChild(createOrderCard(item));
    });
  }

  document
    .getElementById("filterButton")
    .addEventListener("click", function () {
      const customerName = document.getElementById("customerFilter").value;
      const date = document.getElementById("dateFilter").value;
      fetchRequestsHistory(customerName, date);
    });

  const logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

  fetchRequestsHistory();
});
