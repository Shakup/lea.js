(function (factory) {

	var Lea = factory();

	/* ==========================================================================
	   AMD Compliant For Use With RequireJS
	   ========================================================================== */

	if (typeof define === "function" && define.amd) {
		define(["Lea"], Lea);
	} else {
		window.Lea = window.$ = Lea;
	}

}(function () {

	if (typeof StopIteration == undefined) {
		var StopIteration = new Error("StopIteration");
	}



	/* ==========================================================================
	   Lea.js constructor
	   ========================================================================== */

	var Lea = function (query, context) {
		if (context == undefined) {
			context = window.document;
		}

		if (this == undefined || this === window) {
			return new Lea(query, context);
		}

		if (query == null) {
			this.elements = [];
			return this;
		}

		if (Lea.type(query) !== "array") {
			query = [query];
		}

		this.elements = [];

		query.forEach((function (obj) {
			if (Lea.isNode(obj)) {
				this.elements.push(obj);	
			} else if (Lea.type(obj) === "string") {
				this.elements = this.elements.concat(Lea.toArray(context.querySelectorAll(obj)));
			}
		}).bind(this));

		return this;
	};



	/* ==========================================================================
	   About informations
	   ========================================================================== */	

	Lea.about = {
		version  : "{{version}}",
		homepage : "{{homepage}}"
	};



	/* ==========================================================================
	   Helpers
	   ========================================================================== */
	
	// [OK] Add method to Lea
	Lea.addMethod = function (name, fn) {
		this.prototype[name] = fn;
	};

	// Execute function on DOM ready
	Lea.ready = function (fn) {
		if (document.readyState != "loading") {
			fn();
		} else {
			document.addEventListener("DOMContentLoaded", fn);
		}
	};

	// Extend
	Lea.extend = function (out) {
		var out = out || {};

		for(var i = 1; i < arguments.length; i++) {
			if (!arguments[i]) continue;

			for(var key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key)) {
					out[key] = arguments[i][key];
				}
			}
		}

		return out;
	};

	// Throw new error
	Lea.error = function (msg) {
		throw new error(msg);
	};

	// [OK] Convert collection to array
	Lea.toArray = function (coll){
		return Array.prototype.slice.call(coll, 0);
	};

	// [OK] Get object type
	Lea.type = function (obj) {
		return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
	};

	// [OK] Check Element
	Lea.isNode = function (obj) {
		return obj instanceof HTMLElement;
	};

	// [OK] Camelize
	Lea.camelize = function (str) {
		if (str.charAt(0) == "-") {
			str = str.slice(1);
		}
		return str.replace(/-\D/g, function (match) {
			return match.charAt(1).toUpperCase();
		});
	};

	// [OK] Dashize 
	Lea.dashize = function (str) {
		return str.replace(/[A-Z]/g, function (match) {
			return ("-" + match.charAt(0).toLowerCase());
		});
	};

	// [OK] Parse object
	Lea.forEach = function (obj, fn, bind) {
		for(key in obj) {
			if (obj.hasOwnProperty(key)) {
				fn.call(bind || obj, key, obj[key]);
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

	// [OK] Create Html Element 
	Lea.create = function (tag, attr) {
		var elt = document.createElement(tag);

		if (attr != undefined) {
			Lea.forEach(attr || {}, function (key, val) {
				switch(key.toLowerCase()) {
					case "style": 
						elt = $(elt).css(val).get(0);
					break;

					case "html": 
						elt.innerHTML = val;
					break;

					case "text":
						elt.innerText = val;
					break;

					case "class":
						elt.classList.add(val);
					break;

					case "event":
						Lea.forEach(val, function (evt, fn) {
							elt.addEventListener(evt, fn, false);
						});
					break;

					case "data":
						Lea.forEach(val, function (_key, _val) {
							elt.dataset[_key] = _val;
						});
					break;

					default: 
						elt.setAttribute(key, val);
					break;
				}
			});
		}
		return elt;
	};

	// Create or get cookie
	Lea.cookie = function (name, value, options) {
		var stringifyCookieValue = function (value) {
			return encodeURIComponent(options.json ? JSON.stringify(value) : String(value));
		};

		var parseCookieValue = function (s) {
			if (s.indexOf('"') === 0) {
				s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
			}

			try {
				s = decodeURIComponent(s.replace(/\+/g, " "));
				return options.json ? JSON.parse(s) : s;
			} catch(e) {}
		};

		if (value != undefined) {

			if (options == undefined) {
				options = {};
			};

			if (typeof options.expires == "number") {
				var 
					days = options.expires,
					time = options.expires = new Date();
				
				time.setTime(+t + days * 864e+5);
			}

			document.cookie = [
				encodeURIComponent(name), "=", stringifyCookieValue(value),
				options.expires ? "; expires=" + options.expires.toUTCString() : "",
				options.path    ? "; path=" + options.path : "",
				options.domain  ? "; domain=" + options.domain : "",
				options.secure  ? "; secure" : ""
			].join("");

			return this;

		} else {

			var
				result  = {},
				cookies = document.cookie ? document.cookie.split("; ") : [];

			for (var i = 0, l = cookies.length; i < l; i++) {
				var 
					parts     = cookies[i].split("="),
					part_name = decodeURIComponent(parts.shift()),
					cookie    = parts.join("=");

				if (name === part_name) {
					result = parseCookieValue(cookie, value);
					break;
				}
			}
		}
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
			var response;

			try {
				this.elements.forEach(function (element, index) {
					response = action.call(element, element, index);
					if (response === false) throw StopIteration;
				});
			} catch(error) { if (error != StopIteration) throw error; }

			return this;
		},

		// [OK] Get element
		get: function (index) {
			return index != undefined ? this.elements[ index ] || null : this.elements;
		},

		// Get the first element
		first: function () {
			return $(this.hasElements() ? this.get(0) : []);
		},

		// Get the last element
		last: function () {
			return $(this.hasElements() ? this.get(this.elements.length - 1) : []);
		},

		// Get computed style or set style
		css: function (prop, value) {
			if (value != undefined) {
				
				this.each(function () {
					this.style[ Lea.camelize(prop) ] = value;
				});
				return this;

			} else {

				if (Lea.type(prop) === "string") {
					return window.getComputedStyle(this.get(0), null)[ Lea.dashize(prop) ];
				} else if (Lea.type(prop) === "object") {
					this.each(function () {
						var element = this;
						Lea.forEach(prop, function (key, val) {
							element.style[ Lea.camelize(key) ] = val;
						});
					});
					return this;
				}

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
				if (!element.classList.contains(klass)) {
					bool = false;
					return;
				}
			});
			return bool;
		},

		// [OK] Toggle class
		toggleClass: function (klass) {
			this.each(function () {
				var $elt = $(this);
				if( $elt.hasClass(klass) ) {
					$elt.removeClass(klass);
				} else {
					$elt.addClass(klass);
				}
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
		on: function (event, fn) {
			this.each(function () {
				this.addEventListener(event, fn, false);
			}, false);
			return this;
		},

		// Remove event
		off: function (event, fn) {
			this.each(function (){
				this.removeEventListener(event, fn, false);
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
		before: function (obj){
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
				found = found.concat(Lea.toArray(element.querySelectorAll(selector)));
			});
			
			this.elements = found;

			return this;
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

			this.elements = previous;

			return this;
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
			
			this.elements = next;

			return this;
		},

		// [OK] Clear content
		clear: function () {
			this.each(function () {
				this.innerHTML = "";
			});
			return this;
		},

		// [OK] Get or set text content
		text: function (txt) {
			if (txt != undefined) {
				this.each(function () {
					this.textContent = txt;
				});
				return this;
			} else {
				return this.hasElements ? this.elements[0].innerText : "";
			}
		},

		// [OK] Check comparaison
		is: function (selector) {
			var flag = true;

			var matches = function (element) {
				return (element.matches || element.matchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.webkitMatchesSelector || element.oMatchesSelector).call(element, selector);
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
		}
	};

	console.info("Powered by Lea.js" + "\n" + "Version: " + Lea.about.version + "\n" + "Homepage:" + Lea.about.homepage);

	return Lea;

}));