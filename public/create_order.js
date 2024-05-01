document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createOrderForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Extract form data
    const priority = form.priority.value;
    const problem = form.problem.value;
    const problemDetail = form.problemDetail.value;
    const locationDetail = form.locationDetail.value;
    const imageUpload = form.imageUpload.files[0]; // Get the first file uploaded

    // Create formData object to send to API
    const formData = new FormData();
    formData.append("urgency_level", priority);
    formData.append("problem_type", problem);
    formData.append("order_detail", problemDetail);
    formData.append("location_detail", locationDetail);
    formData.append("image", imageUpload);
    console.log(formData);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "login.html";
      }
      const response = await fetch(
        "http://localhost:5005/dashboarddatabase/orders",
        {
          method: "POST",
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
        console.log("Order created successfully!", responseData);
        window.location.href = "customer_dashboard.html";
        return;
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        window.location.href = "login.html";
      }
      console.error("Error creating order:", error);
    }
  });

  const logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
});
