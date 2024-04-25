
  $(document).ready(function(){
    // When any button with data-toggle="modal" is clicked
    $('button[data-toggle="modal"]').click(function(){
      var targetModal = $(this).attr('data-target'); // Get the target modal ID
      $(targetModal).modal(); // Show the modal
    });
  });


