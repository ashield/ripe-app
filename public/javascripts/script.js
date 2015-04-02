$(document).ready(function(){

	$('.taskname').editInPlace({
		callback: function(unused, enteredText) { 
			// return enteredText; 
		},
		// url: '/'
	});
});