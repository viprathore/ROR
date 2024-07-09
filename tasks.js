document.addEventListener('turbolinks:load', () => {
  $('#task_user_ids').select2({
    width: '100%'
  });
  // Get all "dropdowns" elements
  const line_dropdowns = document.querySelectorAll('.lineDropdown');
  line_dropdowns.forEach( (el, i) => {
    var cabinetID = el.dataset.cabinatId
    $("#multiselectLine-"+cabinetID).select2({
      width: '100%'
    });
    if (i !== 0) {
      $(el.nextElementSibling).addClass('is-hidden')
    }
  })

  $(document).on('change', '#task_job_id', function(event) {
    var id = this.value
    $('#task_line_ids_').html('');

    $.ajax({
      type: "GET",
      url: '/admin/jobs/' + id + '/get_lines',
      dataType: 'json'
    }).done(function(data) {
      jQuery.each(data, function(key, value) {
        return $('#task_line_ids_').append($('<option></option>').attr('value', value[0]).text(value[1]));
      });
    });
  });

  // Get all "toggle-line buttons" elements
  const toggle_buttons = document.querySelectorAll('.lineToggleBtn');
  toggle_buttons.forEach( el => {
    el.addEventListener('click', (event) => {
      var eventCabinetID = event.target.dataset.cabinetId
      $.each( $('.lineDropdown'), function( i, el ) {
        var cabinetID = el.dataset.cabinatId
        if (parseInt(eventCabinetID) === parseInt(cabinetID)) {
          $(el.nextElementSibling).removeClass('is-hidden')
        } else {
          $(el.nextElementSibling).addClass('is-hidden')
        }
      });
    });
  });
});

$(document).on('change', '.task-image', function() {
  var input = document.getElementById('image');
  var children = "";

  if ($('#table-task-images > tbody:last > tr').text() == 'No images') {
    $('#table-task-images > tbody:last').html('');
  }

  for (var i = 0; i < input.files.length; ++i) {
    $('#table-task-images > tbody:last').append('<tr><td colsapn="2" style="text-align: center; height:100px;width:100px" id='+ i +'></td><td><input type="text" placeholder="rename image(optional)" name="rename_image['+ input.files[i].name +']" id='+ input.files[i].name +'></td></tr>');

    var image = window.URL.createObjectURL(input.files[i]);
    $("#"+ i).css("background-image", "url(" + image + ")");
    $("#"+ i).css("background-size", "80px 80px")
    $("#"+ i).css("background-repeat", "no-repeat")
  }
});

$(document).on('change', '.punchlist-image', function() {
  var input = document.getElementById('image');
  var children = "";

  if ($('#table-punchlist-images > tbody:last > tr').text() == 'No images') {
    $('#table-task-images > tbody:last').html('');
  }

  for (var i = 0; i < input.files.length; ++i) {
    $('#table-punchlist-images > tbody:last').append('<tr><td colsapn="2" style="text-align: center; height:100px;width:100px" id='+ i +'></td><td><input type="text" placeholder="rename image(optional)" name="rename_image['+ input.files[i].name +']" id='+ input.files[i].name +'></td></tr>');

    var image = window.URL.createObjectURL(input.files[i]);
    $("#"+ i).css("background-image", "url(" + image + ")");
    $("#"+ i).css("background-size", "80px 80px")
    $("#"+ i).css("background-repeat", "no-repeat")

  }
});
