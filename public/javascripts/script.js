$(document).ready(function () {
  $("#userSample").click(function() {
    $(this).addClass('active')
    $("#providedSample").removeClass('active')
    $("#sampleInput").removeClass('hidden')
    $("#existingSample").addClass('hidden')
  })
  $("#providedSample").click(function() {
    $(this).addClass('active')
    $("#userSample").removeClass('active')
    $("#sampleInput").addClass('hidden')
    $("#existingSample").removeClass('hidden')
  })
  $("#select-form").submit(function(e) {
    e.preventDefault();
    form = $(this)
    var formData = form.serializeArray();
    $.ajax({
      url: '/api/markov',
      type: 'post',
      dataType: 'json',
      data: {"select": formData[0].value},
      success: function(response){
        $(".output-area").html(response.output)
      }
    })
  })
})
