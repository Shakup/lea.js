define(["lea"], function($) {

	// Submit button
	$("#myForm").on("submit", function (event) {

		// Cancel submission
		event.preventDefault();

		// Send form via ajax
		$(this)
			.submit({json: true})
			.success(function (response) {
				alert( response.status );
			});

	});

	// Display data in console
	$("#show-data").click(function () {
		
		var data = $("#myForm").serialize();

		console.log( data );

	});

});