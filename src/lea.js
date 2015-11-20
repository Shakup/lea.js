(function (factory, root) {

	if ( typeof define === "function" && define.amd ) {
		define( "lea", [], factory );
	} else if ( typeof exports === "object" ) {
		module.exports = factory();
	} else {
		root.Lea = root.$ = factory();
	}

})(function () {

	"use strict";

	/* ==========================================================================
	   Lea.js constructor
	   ========================================================================== */

	var Lea = function (query, context) {
		if ( !(this instanceof Lea) ) {
			return new Lea(query, context);
		}

		var self = this;

		if (context == undefined) {
			context = window.document;
		}

		this.elements = [];

		if (query == null) {
			return this;
		}

		if ( Lea.type(query) !== "array" ) {
			query = [query];
		}

		query.forEach(function (obj) {
			if ( Lea.isNode(obj) || obj === window || obj === document ) {
				self.elements.push(obj);	
			} else if ( Lea.type(obj) === "string" ) {
				self.elements = self.elements.concat(Lea.toArray(context.querySelectorAll(obj)));
			}
		});

		return this;
	};

	Lea.version = "{{version}}";


	/* ==========================================================================
	   Helpers
	   ========================================================================== */
	
	// [OK] Add method to Lea
	Lea.addMethod = function (name, fn) {
		this.prototype[name] = fn;
	};

	// Execute function on DOM ready
	Lea.ready = function (fn) {
		if ( document.readyState != "loading" ) {
			fn();
		} else {
			document.addEventListener( "DOMContentLoaded", fn );
		}
	};

	// Extend
	Lea.extend = function (out) {
		var out = out || {};

		for ( var i = 1; i < arguments.length; i++ ) {
			if (!arguments[i]) continue;

			Lea.parse(arguments[i], function (key, val) {
				out[key] = val;
			});
			/*for ( var key in arguments[i] ) {
				if ( arguments[i].hasOwnProperty(key) ) {
					out[key] = arguments[i][key];
				}
			}*/
		}

		return out;
	};

	// [OK] Convert collection to array
	Lea.toArray = function (coll) {
		return Array.prototype.slice.call( coll, 0 );
	};

	// [OK] Get object type
	Lea.type = function (obj) {
		return Object.prototype.toString.call(obj).replace( /^\[object (.+)\]$/, "$1" ).toLowerCase();
	};

	// [OK] Check Element
	Lea.isNode = function (obj) {
		return obj instanceof HTMLElement;
	};

	// [OK] Camelcase
	Lea.camelcase = function (str) {
		if ( str.charAt(0) == "-" ) {
			str = str.slice(1);
		}

		return str.replace( /-\D/g, function (match) {
			return match.charAt(1).toUpperCase();
		} );
	};

	// [OK] Dash 
	Lea.dash = function (str) {
		return str.replace( /[A-Z]/g, function (match) {
			return ( "-" + match.charAt(0).toLowerCase() );
		} );
	};

	// [OK] Parse object
	Lea.parse = function (obj, fn, context) {
		for ( var key in obj ) {
			if (obj.hasOwnProperty(key)) {
				fn.call( context || obj, key, obj[key] );
			}
		}
	};

	// [OK] Convert string to node
	Lea.str2Node = function (str) {
		if (Lea.isNode(str)) {
			return str;
		}

		var div = document.createElement("div");
		div.innerHTML = str;
		
		return Array.prototype.slice.call(div.childNodes, 0);
	};

	Lea.cookie = {
		get: function (key) {
			if (!key) { return null; }
			return decodeURIComponent( document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1") ) || null;
		},
		set: function (key, value, vEnd, sPath, sDomain, bSecure) {
			if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) { return false; }
			var sExpires = "";
			if (vEnd) {
				switch (vEnd.constructor) {
					case Number:
						sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
					break;
					case String:
						sExpires = "; expires=" + vEnd;
					break;
					case Date:
						sExpires = "; expires=" + vEnd.toUTCString();
					break;
				}
			}
			document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
			return true;
		},
		remove: function (key, sPath, sDomain) {
			if (!this.exists(key)) { return false; }
			document.cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
			return true;
		},
		exists: function (key) {
			if (!key) { return false; }
			return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		},
		keys: function () {
			var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
			for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
				aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
			}
			return aKeys;
		}
	};

	// [OK] Create Html Element 
	Lea.create = function (tag, attr) {
		var elt = document.createElement(tag);

		if (attr != undefined) {
			Lea.parse( attr || {}, function (key, val) {
				switch(key.toLowerCase()) {
					case "style": 
						elt = Lea(elt).css(val).get(0);
					break;

					case "html": 
						elt.innerHTML = val;
					break;

					case "class":
						elt.classList.add(val);
					break;

					case "event":
						Lea.parse(val, function (evt, fn) {
							elt.addEventListener(evt, fn, false);
						});
					break;

					case "data":
						Lea.parse(val, function (_key, _val) {
							elt.dataset[_key] = _val;
						});
					break;

					default: 
						elt.setAttribute(key, val);
					break;
				}
			} );
		}

		return elt;
	};

	// [OK] Get device type (tablet / phone / desktop)
	Lea.device = function (type) {
		var ua = navigator.userAgent.toLowerCase();

		var device = (function () {
			if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) {
				return "tablet";
			} else if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(ua)) {
				return "phone";
			} else {
				return "desktop";
			}
		})();

		return type != undefined ? (device === type) : device;
	};

	// Check if mobile
	Lea.isMobile = function () {
		return !Lea.device("desktop");
	};

	// Ajax
	Lea.ajax = function (_url, _options) {
		function httpRequest (url, options) {
			var
				cb   = (function(response){}).bind(this),
				self = this;

			this.options = Lea.extend({
				method: "GET",
				always: cb,
				then: cb,
				catch: cb,
				send: true,
				async: true,
				data: {},
				withCredentials: false,
				contentType: "application/x-www-form-urlencoded"
			}, options || {});

			this.transport      = new XMLHttpRequest();
			this.options.method = this.options.method.toUpperCase();
			this.parameters     = "";

			this.transport.onreadystatechange = function () {
				if (this.readyState == 4) {

					self.options.always.call( self, this );
					
					if (this.status == 200 || this.status === 0) {

						var
							responseContentType = this.getResponseHeader("Content-Type"),
							response;

						if (responseContentType && responseContentType.indexOf("application/json") > -1) {
							response = JSON.parse(this.responseText);
						} else {
							response = this.responseText;
						}
						
						self.options.then.call( self, response, this );

					} else {
						self.options.catch.call( self, this );
					}

				}
			};

			this.transport.withCredentials = this.options.withCredentials;

			this.transport.open(this.options.method, url, this.options.async);

			this.transport.setRequestHeader( "X-Requested-With", "XMLHttpRequest" );

			if ( this.options.method == "POST" ) {
				this.transport.setRequestHeader( "Content-Type", this.options.contentType );

				Lea.parse( this.options.data, function (key, val) {
					if (self.parameters.length) {
						self.parameters += "&";
					}
					self.parameters += encodeURIComponent(key) + "=" + encodeURIComponent(val);
				} );
			}

			if (this.options.send) {
				this.send();
			}
		};

		httpRequest.prototype = {
			always: function (cb) {
				this.options.always = cb.bind(this);
				return this;
			},
			then: function (cb) {
				this.options.then = cb.bind(this);
				return this;
			},
			catch: function (cb) {
				this.options.catch = cb.bind(this);
				return this;
			},
			send: function () {
				this.transport.send( this.parameters.length ? this.parameters : null );
				return this;
			},
			abort: function () {
				this.transport.abort();
				return this;
			}
		};

		return new httpRequest(_url, _options);
	};

	// Ajax Get
	Lea.get = function (url, options) {
		return Lea.ajax( url, Lea.extend( options || {}, {method: "GET"} ) );
	};

	// Ajax Post
	Lea.post = function (url, data, options) {
		return Lea.ajax( url, Lea.extend( options || {}, {method: "POST", data: data || {}} ) );
	};

	// [OK] Debounce
	Lea.debounce = function (fn, delay) {
		var timer;
		
		return function () {
			var
				args    = arguments,
				context = this;
		
			clearTimeout(timer);
			
			timer = setTimeout(function () {
				fn.apply( context, args );
			}, delay);
		}
	};

	// [OK] Throttle
	Lea.throttle = function (fn, delay) {
		var last, timer;
		
		return function () {
			var
				context = this,
				now     = +new Date(),
				args    = arguments;
			
			if ( last && now < last + delay ) {
				
				clearTimeout(timer);
				timer = setTimeout(function () {
					last = now;
					fn.apply( context, args );
				}, delay);

			} else {
				last = now;
				fn.apply( context, args );
			}
		};
	};


	/* ==========================================================================
	   Methods
	   ========================================================================== */
	
	Lea.prototype = {

		// [OK] Check elements
		hasElements: function () {
			return this.elements.length > 0;
		},

		// Loop on each elements
		each: function (action) {
			var response, err = new Error("Break");

			this.elements.forEach(function (element, index) {
				response = action.call( element, element, index );
				if (response === false) throw err;
			});

			return this;
		},

		// [OK] Get element
		get: function (index) {
			return index != undefined ? this.elements[ index ] || null : this.elements;
		},

		// Get the first element
		first: function () {
			return new Lea(this.hasElements() ? this.get(0) : []);
		},

		// Get the last element
		last: function () {
			return new Lea( this.hasElements() ? this.get(this.elements.length - 1) : [] );
		},

		// Get computed style or set style
		css: function (prop, value) {

			if (value != undefined) {
				
				this.each(function () {
					this.style[ Lea.camelcase(prop) ] = value;
				});

				return this;

			} else {

				if ( Lea.type(prop) === "string" ) {
					return window.getComputedStyle( this.get(0), null )[ Lea.dash(prop) ];
				} else if ( Lea.type(prop) === "object" ) {

					this.each(function () {
						var element = this;

						Lea.parse( prop, function (key, val) {
							element.style[ Lea.camelcase(key) ] = val;
						} );
					});

					return this;
				}

			}
		},

		// Get height
		height: function () {
			var element = this.elements[0];

			if (element == window) {
				return window.innerHeight;
			}

			if (element == document) {
				return document.body.clientHeight;
			}

			return element.offsetHeight;
		},

		// Get width
		width: function () {
			var element = this.elements[0];
			
			if (element == window) {
				return window.innerWidth;
			}

			if (element == document) {
				return document.body.clientWidth;
			}

			return element.offsetWidth;
		},

		// [OK] Get scroll offsets
		scroll: function () {
			var element = this.elements[0];

			if (element == window) {
				return {
					top: element.scrollY,
					left: element.scrollX,
					width: document.body.scrollWidth,
					height: document.body.scrollHeight
				};
			} else {
				return {
					top: element.scrollTop,
					left: element.scrollLeft,
					width: element.scrollWidth,
					height: element.scrollHeight
				};
			}
		},

		// [OK] Get or set value
		val: function (value) {
			if (value != undefined) {
				this.each(function(){
					this.value = value;
				});
				return this;
			} else {
				return this.elements[0].value || "";
			}
		},

		// [OK] Add class
		addClass: function (klass) {
			this.each(function () {
				this.classList.add(klass);
			});
			return this;
		},

		// [OK] Remove class
		removeClass: function (klass) {
			this.each(function () {
				this.classList.remove(klass);
			});

			return this;
		},

		// [OK] Check class exists
		hasClass: function (klass) {
			var bool = true;

			this.elements.forEach(function (element) {
				if ( !element.classList.contains(klass) ) {
					bool = false;
					return;
				}
			});

			return bool;
		},

		// [OK] Toggle class
		toggleClass: function (klass) {
			this.each(function () {
				this.classList.toggle(klass);
				/*var $elt = Lea(this);

				if( $elt.hasClass(klass) ) {
					$elt.removeClass(klass);
				} else {
					$elt.addClass(klass);
				}*/

			});

			return this;
		},

		// [OK] Show element
		show: function (display) {
			if (display == undefined) var display = "block";

			this.each(function () {
				this.style.display = display;
			});

			return this;
		},

		// [OK] Hide element
		hide: function () {
			this.each(function () {
				this.style.display = "none";
			});

			return this;
		},

		// Toggle display
		toggle: function (display) {
			if (display == undefined) var display = "block";

			this.each(function (){
				this.style.display = Lea(this).css("display") == "none" ? display : "none";
			});

			return this;
		},

		// Insert or get Html from element
		html: function (src) {
			if (src == undefined) {
				return this.get(0).innerHTML;
			} else {

				this.each(function () {
					this.innerHTML = src;
				});

				return this;

			}
		},

		// Add event
		on: function (events, fn) {
			var tabevts = events.split(" ");

			this.each(function (element) {
				tabevts.forEach(function (event) {
					element.addEventListener(event, fn, false);
				});
			}, false);

			return this;
		},

		// Remove event
		off: function (events, fn) {
			var tabevts = events.split(" ");

			this.each(function (element) {
				tabevts.forEach(function (event) {
					element.removeEventListener(event, fn, false);
				});
			});

			return this;
		},

		// [OK] Live event
		delegate: function (selector, events, fn) {
			var tabevts = events.split(" ");

			this.each(function (element) {
				tabevts.forEach(function (event) {
					element.addEventListener(event, function (evt) {
						if ( Lea(evt.target).is(selector) ) {
							fn.call(evt.target, event);
						}
					}, false );
				});
			});

			return this;
		},

		// Fire event
		trigger: function (event){
			var evt = document.createEvent("HTMLEvents");
			
			evt.initEvent(event, true, true);

			this.each(function () {
				this.dispatchEvent(evt);
			});

			return this;
		},

		// Apply "click" event
		click: function (fn) {
			return this.on("click", fn);
		},

		// Set or get attribute
		attr: function (attr, val){
			if (val != undefined) {

				this.each(function () {
					this.setAttribute(attr, val);
				});

				return this;

			} else {
				return this.elements[0].getAttribute(attr);
			}
		},

		// Remove attribute
		removeAttr: function (attr) {
			this.each(function () {
				this.removeAttribute(attr);
			});

			return this;
		},

		// [OK] Set or get data
		data: function (data, value) {
			if (value != undefined) {

				this.each(function () {
					this.dataset[data] = value;
				});

				return this;

			} else {
				return this.get(0).dataset[data];
			}
		},

		// [OK] Remove data
		removeData: function (data) {
			this.each(function () {
				delete this.dataset[data];
			});

			return this;
		},

		// Clone node
		clone: function () {
			return this.elements[0].cloneNode(true);
		},

		// [OK] Append element 
		append: function (obj) {
			this.each(function (element) {

				if (Lea.isNode(obj)) {
					element.appendChild(obj);
				} else {
					var nodes = Lea.str2Node(obj);

					nodes.forEach(function (node) {
						element.appendChild(node);
					});
				}

			});

			return this;
		},

		// [OK] Prepend element
		prepend: function (obj) {
			this.each(function (element) {

				if (Lea.isNode(obj)) {
					element.insertBefore(obj, element.firstChild);
				} else {

					var nodes = Lea.str2Node(obj);

					nodes.forEach(function (node) {
						element.insertBefore(node, element.firstChild);
					});

				}

			});
			return this;
		},

		// [OK] Insert element before an other element
		before: function (obj) {
			this.each(function () {
				this.insertAdjacentHTML("beforebegin", obj);
			});

			return this;
		},

		// [OK] Insert element after an other element
		after: function (obj) {
			this.each(function () {
				this.insertAdjacentHTML("afterend", obj);
			});

			return this;
		},

		// [OK] Remove element from DOM
		remove: function (){
			this.each(function () {
				this.parentNode.removeChild(this);
			});

			return this;
		},

		// [OK] Get parent
		parent: function (){
			var parents = [];

			this.each(function () {
				var parent = this.parentNode;
				if (parent) {
					parents.push(parent);
				}
			});
			
			return new Lea(parents);
		},

		// [OK] Find elements
		find: function (selector) {
			var found = [];

			this.elements.forEach(function (element) {
				found = found.concat( Lea.toArray(element.querySelectorAll(selector)) );
			});

			return new Lea(found);
		},

		// [OK] Get previous element
		prev: function () {
			var previous = [];

			this.each(function () {
				var prev = this.previousElementSibling;
				if (prev) {
					previous.push(prev);
				}
			});

			return new Lea(previous);
		},

		// [OK] Get next element
		next: function () {
			var next = [];

			this.each(function () {
				var nex = this.nextElementSibling;
				if (nex) {
					next.push(nex);
				}
			});

			return new Lea(next);
		},

		// [OK] Clear content
		clear: function () {
			this.each(function () {
				this.innerHTML = "";
			});

			return this;
		},

		// [OK] Check comparaison
		is: function (selector) {
			var
				flag    = true,
				matches = function (element) {
					return (element.matches || element.matchesSelector || element.msMatchesSelector || element.webkitMatchesSelector).call(element, selector);
				};

			this.each(function () {
				flag = matches(this);
				return flag;
			});

			return flag;
		},

		// [OK] Get offset
		offset: function () {
			if (!this.hasElements()) return {top:0,left:0}

			var
				element = this.elements[0],
				rect    = element.getBoundingClientRect();

			return {
				top: rect.top + document.body.scrollTop,
				left: rect.left + document.body.scrollLeft
			};
		},

		// [OK] Get position
		position: function () {
			if (!this.hasElements()) return {top:0,left:0}

			var rect = this.elements[0].getBoundingClientRect();

			return {
				top: rect.top,
				left: rect.left
			};
		},

		// [OK] Replace from Html
		replaceWith: function (html) {
			this.each(function () {
				this.outerHTML = html;
			});

			return this;
		},

		// [OK] Serialize form
		serialize: function () {
			var
				form   = this.elements[0],
				serial = {},
				l, j;

			if (form.nodeName.toLowerCase() !== "form") {
				return serial;
			}

			Lea.toArray(form.elements).forEach(function (field) {

				if (field.name && (["file", "button", "reset", "submit"]).indexOf(field.type) == -1) {
					if (field.type == "select-multiple") {
						l = form.elements[i].options.length; 
						
						for (j = 0; j < l; j++) {
							if (field.options[j].selected) {
								serial[field.name] = field.options[j].value;
							}
						}
						
					} else if ( (field.type != "checkbox" && field.type != "radio") || field.checked) {
						serial[field.name] = field.value;
					}
				}

			});

			return serial;
		},

		submit: function (options) {
			var form = this.elements[0];

			if (form.nodeName.toLowerCase() !== "form") {
				return false;
			}

			options = Lea.extend({
				method: form.method || "GET",
				data: Lea(form).serialize()
			}, options || {});

			return Lea.ajax( form.action || "#", options );
		}
	};

	console.info("Powered by lea.js v" + Lea.version);

	//window.Lea = window.$ = Lea;

	return Lea;

}, this);