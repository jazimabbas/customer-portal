// JavaScript to handle modal trigger and form submission
const editButtons = document.querySelectorAll('.edit-btn');
const submitEditBtn = document.getElementById('submitEdit');

editButtons.forEach(button => {
  button.addEventListener('click', () => {
    $('#editModal').modal('show');
  });
});

submitEditBtn.addEventListener('click', () => {
  // Add your code here to handle form submission
  // You can retrieve input values using document.getElementById or other methods
  // For example:
  // const name = document.getElementById('editName').value;
  // const email = document.getElementById('editEmail').value;
  // Then you can process these values as needed (e.g., send them to the server)
  // Once done, you can close the modal
  $('#editModal').modal('hide');
});