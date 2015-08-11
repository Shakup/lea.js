;(function( root ) {

	/* ==========================================================================
	   Lea.js constructor
	   ========================================================================== */

	var Lea = function( query, context ) {
		if( context == undefined ) {
			context = document;
		}

		if( this === root ) {
			return new Lea( query, context );
		}

		if( query == null ) {
			this.elements = [];
			return this;
		}

		if( !Lea.isArray( query ) ) {
			query = [query];
		}

		this.elements = [];

		query.forEach( (function( obj ){
			if( Lea.isNode( obj ) ) {
				this.elements.push( obj );	
			} else if( Lea.isString( obj ) ) {
				this.elements = this.elements.concat( Lea.toArray( context.querySelectorAll( obj ) ) );
			}
		}).bind(this) );

		return this;
	};

	Lea.about = {
		version  : "{{version}}",
		homepage : "{{homepage}}"
	};



	/* ==========================================================================
	   Helpers
	   ========================================================================== */
	
	// Throw new error
	Lea.error = function( msg ) {
		throw new error( msg );
	};

	// Convert collection to array
	Lea.toArray = function( coll ){
		return Array.prototype.slice.call( coll, 0 );
	};

	// Check function
	Lea.isFunction = function( obj ) {
		return typeof obj === "function";
	};

	// Check object
	Lea.isObject = function( obj ) {
		return typeof obj === "object" && !Lea.isArray( obj );
	};

	// Check array
	Lea.isArray = function( obj ) {
		return Array.isArray( obj );
	};

	// Check numeric
	Lea.isNumeric = function( obj ) {
		return !Lea.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
	};

	// Check string
	Lea.isString = function( obj ) {
		return typeof obj === "string";
	};

	// Check Element
	Lea.isNode = function( obj ) {
		return obj instanceof HTMLElement;
	};

	// Camelize
	Lea.camelize = function( str ) {
		if( str.charAt(0) == '-') {
			str = str.slice(1);
		}
		return str.replace( /-\D/g, function( match ) {
			return match.charAt( 1 ).toUpperCase();
		});
	};

	// Dashize
	Lea.dashize = function( str ) {
		return str.replace( /[A-Z]/g, function( match ) {
			return ( '-' + match.charAt( 0 ).toLowerCase() );
		});
	};

	// ForEach for objects and arrays
	Lea.forEach = function( obj, fnc, bind ) {
		if( Lea.isArray( obj ) ) {
			obj.forEach( fnc.bind(bind || obj) );
		} else {
			for( key in obj ) {
				if( obj.hasOwnProperty(key) ) {
					fnc.call( bind || obj, key, obj[key] );
				}
			}
		}
	};

	// Convert string to node
	Lea.str2Node = function( str ) {
		var div = document.createElement( "div" );
		div.innerHTML = str;
		return Array.prototype.slice.call( div.childNodes, 0 );
	};

	// Convert RGB value to Hexadecimal
	Lea.rgb2hex = function( rgb ){
		if( rgb.search( "rgb" ) == -1) {
			return rgb;
		} else if( rgb == "rgba(0, 0, 0, 0)" ) {
			return "transparent";
		} else {
			rgb = rgb.match( /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/ );
			
			var hex = function( x ) {
				return ( "0" + parseInt(x).toString(16) ).slice(-2);
			};

			return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]); 
		}
	};

	// Create Html Element
	Lea.create = function( tag, attr ) {
		var elt = document.createElement( tag );

		if( attr != undefined ) {
			Lea.each( attr || {}, function( key, val ) {
				switch( key.toLowerCase() ) {
					case "style": 
						elt = $( elt ).css( val ).get( 0 );
					break;

					case "html": 
						elt = $( elt ).html( val ).get( 0 );
					break;

					case "class":
						elt = $(elt).addClass( val ).get( 0 );
					break;

					case "event":
						Lea.each( val, function( evt, fnc ) {
							elt = $( elt ).on( evt, fnc ).get( 0 );
						});
					break;

					default: 
						elt = $( elt ).attr( key, val ).get( 0 );
					break;
				}
			});
		}
		return elt;
	};



	/* ==========================================================================
	   Functions
	   ========================================================================== */
	
	Lea.prototype = {

		// Loop on each elements
		each: function( action ) {
			this.elements.forEach(function( element, index ) {
				action.call(element, element, index);
			});

			return this;
		},

		// Get element
		get: function( index ) {
			return index != undefined ? this.elements[ index ] || null : this.elements;
		},

		// Get the first element
		first: function() {
			return $( this.get(0) );
		},

		// Get the last element
		last: function() {
			return $( this.elements.length ? this.get( this.elements.length - 1 ) : null );
		},

		// Get computed style or set style
		css: function( prop, value ) {
			if( value != undefined ) {
				
				this.each( function() {
					this.style[ Lea.camelize( prop ) ] = value;
				});
				return this;

			} else {

				if( Lea.isString( prop ) ) {
					return root.getComputedStyle( this.get(0), null ).getPropertyValue( Lea.dashize(prop) );
				} else if ( Lea.isObject( prop ) ) {
					this.each( function() {
						var element = this;
						Lea.forEach( prop, function( key, val ) {
							element.style[ Lea.camelize( key ) ] = val;
						});
					});
					return this;
				}

			}
		},

		// Add class
		addClass: function( klass ) {
			this.each(function() {
				this.classList.add( klass );
			});
			return this;
		},

		// Remove class
		removeClass: function( klass ) {
			this.each(function() {
				this.classList.remove( klass );
			});
			return this;
		},

		// Check class exists
		hasClass: function( klass ) {
			var bool = true;
			this.elements.forEach(function( element ) {
				if( !element.classList.contains( klass ) ) {
					bool = false;
					return;
				}
			});
			return bool;
		},

		// Show element
		show: function( display ) {
			if( display == undefined ) var display = 'block';

			this.each(function() {
				this.style.display = display;
			});

			return this;
		},

		// Hide element
		hide: function() {
			this.each(function() {
				this.style.display = 'none';
			});

			return this;
		},

		// Toggle show/hide on element
		toggle: function( display ) {
			if( display == undefined ) var display = 'block';

			this.each(function(){
				this.style.display = Lea( this ).css( 'display' ) == 'none' ? display : 'none';
			});

			return this;
		},

		// Insert or get Html from element
		html: function( src ) {
			if( src == undefined ) {
				return this.get( 0 ).innerHTML;
			} else {
				this.each(function() {
					this.innerHTML = src;
				});
				return this;
			}
		},

		// Add event
		on: function( event, fnc ) {
			this.each(function() {
				this.addEventListener(event, fnc, false);
			}, false);
			return this;
		},

		// Remove event
		off: function( event, fnc ) {
			this.each(function(){
				this.removeEventListener( event, fnc, false);
			});
			return this;
		},

		// Fire event
		trigger: function( event ){
			var evt = document.createEvent( "HTMLEvents" );
			evt.initEvent( event, true, true );

			this.each(function() {
				this.dispatchEvent( evt );
			});

			return this;
		},

		// Apply "click" event
		click: function( fnc ) {
			return this.on( 'click', fnc );
		},

		// Set or get attribute
		attr: function( attr, val ){
			if( val != undefined) {
				this.each(function() {
					this.setAttribute( attr, val );
				});
				return this;
			} else {
				return this.elements[0].getAttribute( attr );
			}
		},

		// Remove attribute
		removeAttr: function( attr ) {
			this.each(function() {
				this.removeAttribute( attr );
			});
			return this;
		},

		// Set or get data attribute
		data: function( data, value ) {
			if( value != undefined ) {
				this.each(function() {
					this.dataset[data] = value;
				});
				return this;
			} else {
				return this.get( 0 ).dataset[data];
			}
		},

		removeData: function( data ) {
			this.each(function() {
				delete this.dataset[data];
			});
			return this;
		},

		// Clone node
		clone: function() {
			return this.elements[0].cloneNode(true);
		},

		// Append element 
		append: function( obj ) {
			this.each(function( element ) {
				if( Lea.isNode( obj ) ) {
					element.appendChild( obj );
				} else {
					var nodes = Lea.str2Node( obj );
					nodes.forEach(function( node ) {
						element.appendChild( node );
					});
				}
			});
			return this;
		},

		// Prepend element
		prepend: function( obj ) {
			this.each(function( element ) {
				if( Lea.isNode( obj ) ) {
					element.insertBefore(obj, element.firstChild);
				} else {
					var nodes = Lea.str2Node( obj );
					nodes.forEach(function( node ) {
						element.insertBefore( node, element.firstChild );
					});
				}
			});
			return this;
		},

		// Insert element before an other element
		before: function(obj){
			this.each(function( element ){
				var pN = element.parentNode;

				if( Lea.isNode( obj ) ) {
					pN.insertBefore( obj, element );
				} else {
					var nodes = Lea.str2Node( obj );
					nodes.forEach(function( node ) {
						pN.insertBefore( node, element );
					});
				}
			});
			return this;
		},

		// Insert element after an other element
		after: function( obj ) {
			this.each(function( element ){
				var pN =  element .parentNode;
				
				if( Lea.isNode( obj ) ) {
					pN.insertBefore( obj, element .nextSibling );
				} else {
					var nodes = Lea.str2Node( obj );
					nodes.forEach(function( node ) {
						pN.insertBefore( node, element.nextSibling );
					});
				}
			});
			return this;
		},

		remove: function(){
			this.each(function() {
				this.parentNode.removeChild(this);
			});
			return this;
		},

		// Get parent
		parent: function(){
			var parents = [];

			this.each(function() {
				var parent = this.parentNode;
				if( parent ) {
					parents.push(parent);
				}
			});
			
			return new Lea( parents );
		},

		// Find elements
		find: function( selector ) {
			var found = [];

			this.elements.forEach(function(element) {
				found = found.concat( Lea.toArray( element.querySelectorAll( selector ) ) );
			});
			
			this.elements = found;

			return this;
		},

		// Get previous element
		prev: function() {
			var previous = [];

			this.each(function() {
				var prev = this.previousElementSibling;
				if( prev ) {
					previous.push( prev );
				}
			});

			this.elements = previous;

			return this;
		},

		// Get next element
		next: function(){
			var next = [];

			this.each(function() {
				var nex = this.nextElementSibling;
				if( nex ) {
					next.push(nex);
				}
			});
			
			this.elements = next;

			return this;
		}

	};

	root.Lea = root.$ = Lea;

	console.info( "Powered by Lea.js" + "\n" + "Version: " + Lea.about.version + "\n" + "Homepage:" + Lea.about.homepage );

})( typeof window != undefined ? window : this );