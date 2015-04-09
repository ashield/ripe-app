$(document).ready(function(){
// TASK update and add new
// var task = $(this).data('id');
	$('.taskname').editInPlace({
		callback : function (unused, enteredText) {
			var payload = $(this).text();
			var user_id = window.location.pathname.substring("/users/".length);
			if ($(this).data('id') == undefined) {
				console.log('we need a new task for this one')
				$.ajax({
				  type: "POST",
				  url: '/users/' + user_id,
				  data: {taskname: payload, user: user_id },// JSON.stringify
				  success: function() { window.location.reload(true); }, 
				  dataType: 'json'
				}); 
			}

			else {
				$.ajax({
				  type: "POST",
				  url: '/users/' + user_id + '/' + $(this).data('id'),
				  data: {taskname: payload }, // JSON.stringify
				  success: null, //console.log('/tasks/' + $(this).data('id')),
				  dataType: 'json'
				}); 
			}

			console.log($(this).text())
			console.log('/users/' + user_id + '/' + $(this).data('id'))
			return enteredText;
		}
	});



// PROJECT add new - inline

	$('.project-taskname').editInPlace({
		callback : function (unused, enteredText) {
			var payload = $(this).text();
			var project_id = window.location.pathname.substring("/projects/".length);
			
			if ($(this).data('id') == undefined) {
				console.log('we need a new task for this one')
				$.ajax({
				  type: "POST",
				  url: '/projects/' + project_id,
				  data: {taskname: payload, project_id: project_id},// JSON.stringify
				  success: function() { window.location.reload(true); }, 
				  dataType: 'json'
				}); 
			}

			else {
			$.ajax({
			  type: "POST",
			  // url: '/projects/' + $(this).data('id'),
				url: '/projects/' + project_id + '/' +  $(this).data('id'),
			  data: {taskname: payload, project_id: project_id}, // JSON.stringify
			  success: null, //console.log('/tasks/' + $(this).data('id')),
			  dataType: 'json'
			});
		}
			console.log($(this).text())
			return enteredText;
		}
	});

	$(function () {
	    $('.task').on('click', '.delete', function (evt) {
	        // if (confirm('Are you sure you want to delete this item?')) {
	            deleteTask($(evt.target).data('id'));
	        // }
	    });
	});

	function deleteTask(id) {
		var user_id = window.location.pathname.substring("/users/".length);
	    $.ajax({
	        type: 'DELETE',
	        url: '/users/' + user_id + '/' + $('.taskname').data('id'),
	    }).fail(function (err) {
	        console.error(err);
	    }).done(function () {
	        location.reload();
	    });
	    console.log($('.taskname').data('id'))
	}

	$(function () {
	    $('.task').on('click', '.project-task-delete', function (evt) {
	        // if (confirm('Are you sure you want to delete this item?')) {
	            deleteProjectTask($(evt.target).data('id'));
	        // }
	    });
	});

	function deleteProjectTask(id) {
		var project_id = window.location.pathname.substring("/projects/".length);
	    $.ajax({
	        type: 'DELETE',
	        url: '/projects/' + project_id + '/' +  $('.project-task-delete').data('id'),
	    }).fail(function (err) {
	        console.error(err);
	    }).done(function () {
	        location.reload();
	    });
	    // console.log($('.taskname').data('id'))
	}


	$(function () {
	    $('.project-delete').on('click', '.delete', function (evt) {
	        // if (confirm('Are you sure you want to delete this item?')) {
	            deleteProject($(evt.target).data('id'));
	        // }
	    });
	});

	function deleteProject(id) {
		var project_id = window.location.pathname.substring("/projects/".length);
		var redirectURL = "/projects";
	    $.ajax({
	        type: 'DELETE',
	        url: '/projects/' + project_id,
	    }).fail(function (err) {
	        console.error(err);
	    }).done(function () {
	        window.location = redirectURL;
	    });
	    // console.log($('.taskname').data('id'))
	}


	// Form inject for creating project tasks
	$('.project-add').click(function () {
		$('.project-form').addClass('show');
	})
	$('.cancel').click(function () {
		$('.project-form').removeClass('show');
	});



	$('.complete').on('click', '.cBox', function updateComplete() {
		// will need to loop through all the checkboxes so they don't interfer with each other
		var x=$("#complete").is(":checked");
		var user_id = window.location.pathname.substring("/users/".length);
		// var payload = $(this).cBox.val();
		// var payload = $(this).text();
			if (x == true) {
				console.log($("input[type='checkbox']").val());
				$.ajax({
				  type: "POST",
					url: '/users/' + user_id + '/' + $(this).data('id'),
				  data: {complete: true}, // JSON.stringify
				  success: null, //console.log('/tasks/' + $(this).data('id')),
				  dataType: 'json'
				});
			} else {
				console.log($("input[type='checkbox']").val());
			}

	});



});



/*
  Slidemenu
*/
(function() {
	var $body = document.body
	, $menu_trigger = $body.getElementsByClassName('menu-trigger')[0];

	if ( typeof $menu_trigger !== 'undefined' ) {
		$menu_trigger.addEventListener('click', function() {
			$body.className = ( $body.className == 'menu-active' )? '' : 'menu-active';
		});
	}

}).call(this);
