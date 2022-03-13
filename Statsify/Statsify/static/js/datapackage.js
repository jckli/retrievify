$(function(){
    $(".upload-link").on("click", function(event){
        event.preventDefault();
        $("#upload:hidden").trigger("click");
    });
});

$("#upload").on("change", function () {
    var form_data = new FormData();
    form_data.append("file", $("#upload")[0].files[0]);
    $.ajax({
        type: "POST",
        url:  "/ajax/upload",
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        success: function(data) {
            alert(data.status);
        },
    });
});