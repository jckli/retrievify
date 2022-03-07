$(function(){
    $(".upload-link").on('click', function(event){
        event.preventDefault();
        $("#upload:hidden").trigger('click');
    });
});

$('#upload').on('change', function () {
    var myFile = $('#fileinput').prop('files');
    $.post("/ajax/upload", function(data) {
        alert(data.status);
    });
});