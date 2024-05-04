document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createOrderForm");
  const orderId = new URLSearchParams(window.location.search).get("id");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Extract form data
    const pricingDetail = form.pricingDetail.value;
    const imageUpload = form.imageUpload.files[0]; // Get the first file uploaded

    // Create formData object to send to API
    const formData = new FormData();
    formData.append("pricing_detail", pricingDetail);
    formData.append("image", imageUpload);
    console.log(formData);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "login.html";
      }
      const response = await fetch(
        `http://localhost:5005/dashboarddatabase/orders/${orderId}/mark-complete`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 401) {
        window.location.href = "login.html";
      }
      if (response.ok) {
        const responseData = await response.json();
        console.log("Order completed successfully!", responseData);
        window.location.href = "technician_dashboard.html";
        return;
      } else {
        throw new Error("Failed to technician order");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        window.location.href = "login.html";
      }
      console.error("Error technician order:", error);
    }
  });

  const logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
});
