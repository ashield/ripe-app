(function() {
	$('.taskname').editInPlace({
		callback : function (unused, enteredText) {
			var payload = $(this).text();
			var user_id = window.location.pathname.substring("/users/".length);
			if ($(this).data('id') == undefined) {
				console.log('we need a new task for this one')
				$.ajax({
				  type: "POST",
				  url: '/users/' + user_id,
				  data: {taskname: payload, user: user_id },
				  success: function() { window.location.reload(true); }, 
				  dataType: 'json'
				}); 
			}

			else {
				$.ajax({
				  type: "POST",
				  url: '/users/' + user_id + '/' + $(this).data('id'),
				  data: {taskname: payload },
				  success: null,
				  dataType: 'json'
				}); 
			}
			console.log($(this).text())
			console.log('/users/' + user_id + '/' + $(this).data('id'))
			return enteredText;
		}
	});
})();


(function() {
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
				url: '/projects/' + project_id + '/' +  $(this).data('id'),
			  data: {taskname: payload, project_id: project_id},
			  success: null,
			  dataType: 'json'
			});
		}
			console.log($(this).text())
			return enteredText;
		}
	});
})();

(function() {
	$('.controls').on('click', '.delete', function deleteTask() {
		var user_id = window.location.pathname.substring("/users/".length);
	    $.ajax({
	        type: 'DELETE',
	        url: '/users/' + user_id + '/' + $(this).data('id'),
	    }).fail(function (err) {
	        console.error(err);
	    })  .done(function () {
	        location.reload();
	    });
	});
})();

(function() {
	$('.controls').on('click', '.project-task-delete', function deleteTask() {
		var project_id = window.location.pathname.substring("/projects/".length);
	    $.ajax({
	        type: 'DELETE',
	        url: '/projects/' + project_id + '/' +  $(this).data('id'),
	    }).fail(function (err) {
	        console.error(err);
	    }).done(function () {
	        location.reload();
	    });
	});
})();

(function() {
	$('.project-delete').on('click', '.delete', function deleteTask() {
		var project_id = window.location.pathname.substring("/projects/".length);
		var redirectURL = "/projects";
		var warning = confirm("Are you sure you want to delete this entire project?");
		if (warning == true) {
		    $.ajax({
		        type: 'DELETE',
		        url: '/projects/' + project_id,
		    }).fail(function (err) {
		        console.error(err);
		    }).done(function () {
		        window.location = redirectURL;
		    });
		} else {
		    return;
		}

	});
})();

(function() {
	// Form inject for creating project tasks
	$('.project-add').click(function () {
		$('.project-form').toggleClass('show');
	})
	$('.cancel').click(function () {
		$('.project-form').removeClass('show');
	});
})();


(function() {
	$('.complete').on('click', '.cBox', function updateComplete() {
		var user_id = window.location.pathname.substring("/users/".length);
			if ($(":checkbox[data-id='"+$(this).data("id")+"']").is(":checked")) {
				$.ajax({
				  type: "PUT",
					url: '/users/' + user_id + '/' + $(this).data('id'),
				  data: {complete: true},
				  success: null,
				  dataType: 'json'
				});

				$(".taskname[data-id='"+$(this).data("id")+"']").addClass('checked')
				console.log('checked')
			}

	 		if (!$(":checkbox[data-id='"+$(this).data("id")+"']").is(":checked")) {
				$.ajax({
				  type: "PUT",
					url: '/users/' + user_id + '/' + $(this).data('id'),
				  data: {complete: false},
				  success: null,
				  dataType: 'json'
				});
				$(".taskname[data-id='"+$(this).data("id")+"']").removeClass('checked')
				console.log('unchecked')
			}
	});
})();

(function() {
	$('.project-complete').on('click', '.cBox', function updateComplete() {
		var project_id = window.location.pathname.substring("/projects/".length);
			if ($(":checkbox[data-id='"+$(this).data("id")+"']").is(":checked")) {
				$.ajax({
				  type: "PUT",
					url: '/projects/' + project_id + '/' +  $(this).data('id'),
				  data: {complete: true},
				  success: null,
				  dataType: 'json'
				});

				$(".project-taskname[data-id='"+$(this).data("id")+"']").addClass('checked')
				console.log('checked')
			}

	 		if (!$(":checkbox[data-id='"+$(this).data("id")+"']").is(":checked")) {
				$.ajax({
				  type: "PUT",
					url: '/projects/' + project_id + '/' +  $(this).data('id'),
				  data: {complete: false},
				  success: null,
				  dataType: 'json'
				});
				$(".project-taskname[data-id='"+$(this).data("id")+"']").removeClass('checked')
				console.log('unchecked')
			}
	});
})();

(function() {
	var $body = document.body
	, $menu_trigger = $body.getElementsByClassName('menu-trigger')[0];

	if ( typeof $menu_trigger !== 'undefined' ) {
		$menu_trigger.addEventListener('click', function() {
			$body.className = ( $body.className == 'menu-active' )? '' : 'menu-active';
		});
	}

}).call(this);
