
/* Technician Schedule Filter */
function filterSchedule() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("filter");
  filter = input.value.toUpperCase();
  table = document.getElementById("schedule-table");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the filter
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[3]; // Technician name column
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1 || filter === '') {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
}


/* Popup windows for Declining Request */
document.addEventListener('DOMContentLoaded', function () {
  // Get all Decline buttons
  var declineButtons = document.querySelectorAll('.decline');

  // Add click event listener to each Decline button
  declineButtons.forEach(function(button) {
    button.addEventListener('click', function () {
      // Show the modal popup window
      $('#declineModal').modal('show');
    });
  });

  // Handle the click event of the Confirm button inside the modal
  document.getElementById('confirmDecline').addEventListener('click', function () {
    // Get the reason for decline from the textarea
    var declineReason = document.getElementById('declineReason').value;

    // Here, you can perform any further actions with the declineReason, such as sending it to the server

    // Close the modal popup window
    $('#declineModal').modal('hide');
  });
});


/* Confirmation windows for Assigning Technician */
document.addEventListener('DOMContentLoaded', function () {
  // Get all Assign buttons
  var assignButtons = document.querySelectorAll('.assign-btn');

  // Add click event listener to each Assign button
  assignButtons.forEach(function(button) {
    button.addEventListener('click', function () {
      // Show confirmation modal
      $('#confirmationModal').modal('show');

      // Get the assigned technician name
      var technicianName = this.parentNode.parentNode.children[1].textContent;

      // Set technician name in the confirmation modal
      document.getElementById('technicianName').textContent = technicianName;
    });
  });
});


/* Display hidden textbox upon clicking Others*/
document.addEventListener('DOMContentLoaded', function () {
  var otherReasonRadio = document.getElementById('others');
  var otherReasonText = document.getElementById('otherReason');

  // Show text box when "Others" radio button is selected
  otherReasonRadio.addEventListener('change', function () {
    if (this.checked) {
      otherReasonText.style.display = 'block';
    } else {
      otherReasonText.style.display = 'none';
    }
  });
});


/* Filter for Request History*/
document.addEventListener('DOMContentLoaded', function () {
  // Get filter elements
  var customerFilterInput = document.getElementById('customerFilter');
  var dateFilterInput = document.getElementById('dateFilter');
  var filterButton = document.getElementById('filterButton');
  var historyItems = document.querySelectorAll('.history-item');

  // Add click event listener to the filter button
  filterButton.addEventListener('click', function () {
    var customerFilterValue = customerFilterInput.value.trim().toLowerCase();
    var dateFilterValue = dateFilterInput.value;

    // Loop through history items
    historyItems.forEach(function (item) {
      var customerName = item.querySelector('.customer-name').textContent.trim().toLowerCase();
      var completedDate = item.querySelector('.completed-date').textContent.trim();

      // Check if the item matches the filter criteria
      if ((customerName.includes(customerFilterValue) || customerFilterValue === '') &&
          (completedDate.includes(dateFilterValue) || dateFilterValue === '')) {
        item.style.display = 'block'; // Show the item
      } else {
        item.style.display = 'none'; // Hide the item
      }
    });
  });
});


/*Cancel Button in cancel_request page*/
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('submitButton').addEventListener('click', function () {
    // Get form data
    var formData = new FormData(document.getElementById('cancelRequestForm'));

    // Submit the form data using fetch or any other method
    fetch('your-submit-url', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        // Handle successful form submission
        console.log('Form submitted successfully');
      } else {
        // Handle failed form submission
        console.error('Form submission failed');
      }
    })
    .catch(error => {
      console.error('Error submitting form:', error);
    });
  });
});

/* Notification */
