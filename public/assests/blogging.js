$(document).ready(function(){

    // updating category
    $('category').on('click', function(){
         
        let _id = $('form').data('id');
        var category = $('#category').val();
     
        $.ajax({
          type: 'PUT',
          url: '/updateCategory/' + _id,
          data: {category: category},
          success: function(data){
            alert('category updated');
            
            // location.reload();
          }
        });
  
        return false;
  
      });



});