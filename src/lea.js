;(function( root ) {

	'use sctrict';

	var about = {
		version  : "{{version}}",
		author   : "{{author}}",
		homepage : "{{homepage}}"
	}

	function Lea( query, context ) {

		if( query == "undefined" ) {
			console.info( about );
			return about;
		}

		if( context == "undefined" ) {
			context = root;
		}

		if (root === this) {
			return new Lea( query, context );
		}

		return this;

	};

	Lea.prototype.extend = function( obj, donor ) {
		for( var key in donor ) {
			if( donor.hasOwnProperty(key) ) {
				obj[key] = donor[key];
			}
		}
	}

	Lea.prototype = {

		say: function(){
			console.log('Hello');
			return this;
		}

	};

	root.Lea = root.$ = Lea;

})( typeof window !== "undefined" ? window : this );