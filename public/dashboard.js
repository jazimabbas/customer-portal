
document.addEventListener('DOMContentLoaded', function() {
    fetchOrders('pending-orders', updatePendingOrders);
    fetchOrders('ongoing-orders', updateOngoingOrders);
    fetchOrders('count-orders', fetchPendingOrdersCount);
});

function fetchOrders(endpoint, updateFunction) {
    fetch(`/dashboarddatabase/${endpoint}`)
        .then(response => response.json())
        .then(data => {
            alert(JSON.stringify(data)); // Convert the object to a string
            return data; // Return the data for the next then() block
        })
        .then(data => updateFunction(data)) // Update the function with the data
        .catch(error => console.error('Error fetching data:', error));
}

function fetchPendingOrdersCount() {
    fetch('/dashboarddatabase/pending-orders/count')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const pendingOrdersCount = data.count;
            countPendingOrders(pendingOrdersCount); // Call the function to update UI with count
        })
        .catch(error => {
            console.error('Error fetching pending orders count:', error);
        });
}


// Display Pending Orders
function updatePendingOrders(orders) {
    const container = document.querySelector('.customer-pending-list tbody');
    container.innerHTML = ''; // Clear existing entries
    orders.forEach(order => {
        container.innerHTML += `
            <tr>
                <td>${order.order_id}</td>
                <td>${order.order_detail}</td>
                <td class="${order.urgency_level.toLowerCase()}">${order.urgency_level}</td>
                <td><button>View</button></td>
            </tr>
        `;
    });
}

// Display Ongoing Orders
function updateOngoingOrders(orders) {
    const container = document.querySelector('.customer-ongoing-list tbody');
    container.innerHTML = ''; // Clear existing entries
    orders.forEach(order => {
        container.innerHTML += `
        <tr>
        <td>${order.order_id}</td>
        <td>${order.order_detail}</td>
        <td class="${order.urgency_level.toLowerCase()}">${order.urgency_level}</td>
        <td><button>View</button></td>
    </tr>
        `;
    });
}

// Display Technician List
function fetchTechnician() {
    fetch('/dashboarddatabase/technician')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const list = document.getElementById('technician-list');
            list.innerHTML = ''; // Clear existing entries
            data.forEach((request, index) => {
                const row = `<tr>
                    <td>${request.technician_id}</td>
                    <td>${request.name}</td>
                    <td>${request.status}</td>
                    <td>${request.ongoing_order_id}</td>
                    <td>${request.specialization}</td>
                    <td>${request.email}</td>
                </tr>`;
                list.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error fetching pending orders:', error);
        });
}

