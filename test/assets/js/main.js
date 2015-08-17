define(["lea"], function($) {

    $.ready(initialize);

    function initialize () {
		
		$('#btnApply').click(function () {
			$('img').click(the_event).data('info', 'Up');
		});

		$('#btnTrigger').click(function(e){
			$('img').trigger('click');
		});

		$('#btnRemove').click(function(e){
			$('img')
				.off( 'click', the_event )
				.removeData( 'info' );
		});
    }

	function the_event(e){
		console.log( this.src );
		console.log( $(this).data('info') );
	};

});