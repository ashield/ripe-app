$(document).ready(function(){

	
// $('.taskname').on('click', function () {
	
// var task = $(this).data('pk');
	$('.taskname').editInPlace({
		callback : function (unused, enteredText) {
			$.ajax({
			  type: "POST",
			  // url: "/projects/551eb14bd2259516ac7d7887",
			  url: '/tasks/' + $(this).data('pk'),
			  data: $(this).text(),
			  success: console.log('/tasks/' + $(this).data('pk')),
			  dataType: 'json'
			});

			console.log($(this).text())
			return enteredText;
		}
	});
});