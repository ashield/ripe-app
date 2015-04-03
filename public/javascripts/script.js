$(document).ready(function(){


// $('.taskname').on('click', function () {

// var task = $(this).data('pk');
	$('.taskname').editInPlace({
		callback : function (unused, enteredText) {
			var payload = $(this).text();
			var project_id = window.location.pathname.substring("/projects/".length);
			$.ajax({
			  type: "POST",
			  // url: "/projects/551eb14bd2259516ac7d7887",
			  // url: '/projects/' + $(this).data('pk'),
				url: '/projects/' + project_id,
			  data: {taskname: payload, project_id: project_id}, // JSON.stringify
			  success: null, //console.log('/tasks/' + $(this).data('pk')),
			  dataType: 'json'
			});

			console.log($(this).text())
			return enteredText;
		}
	});
});
