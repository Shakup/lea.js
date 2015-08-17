(function (factory) {

	var Lea = new factory();

	/* ==========================================================================
	   AMD Compliant For Use With RequireJS
	   ========================================================================== */

	if (typeof define === "function" && define.amd) {
		define([], Lea);
	//} else if (module != undefined && module.exports) {
	//	module.exports = Lea;
	} else {
		window.Lea = window.$ = Lea;
	}

}(function () {

	"use strict";

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
			if (Lea.isNode(obj) || obj === window || obj === document) {
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

	// [OK] Throw new error
	Lea.error = function (msg) {
		throw new Error(msg);
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
	Lea.forEach = function (obj, fn, context) {
		for(var key in obj) {
			if (obj.hasOwnProperty(key)) {
				fn.call(context || obj, key, obj[key]);
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
	Lea.ajax = function (url, options) {

		this.httpRequest = function () {
			var
				cb    = (function(response){}).bind(this),
				_this = this;

			this.options = Lea.extend({
				method: "GET",
				complete: cb,
				success: cb,
				error: cb,
				send: true,
				async: true,
				data: {},
				json: false,
				contentType: "application/x-www-form-urlencoded"
			}, options || {});

			this.transport      = new XMLHttpRequest();
			this.options.method = this.options.method.toUpperCase();
			this.parameters     = "";

			this.transport.onreadystatechange = function () {
				if (this.readyState == 4) {
					var response = _this.options.json ? JSON.parse(this.responseText) : this.responseText;
					
					_this.options.complete.call( _this, response );

					if (this.status == 200 || this.status === 0) {
						_this.options.success.call( _this, response );
					} else {
						_this.options.error.call( _this, response );
					}
				}
			};

			this.transport.open(this.options.method, url, this.options.async);

			if (this.options.method == "POST") {
				this.transport.setRequestHeader("Content-Type", this.options.contentType);
				
				Lea.forEach(this.options.data, function (key, val) {
					if (_this.parameters.length) {
						_this.parameters += "&";
					}
					_this.parameters += encodeURIComponent(key) + "=" + encodeURIComponent(val);
				});
			}

			if (this.options.send) {
				this.send();
			};
		};

		this.httpRequest.prototype = {
			complete: function (cb) {
				this.options.complete = cb.bind(this);
				return this;
			},
			success: function (cb) {
				this.options.success = cb.bind(this);
				return this;
			},
			error: function (cb) {
				this.options.error = cb.bind(this);
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

		return new this.httpRequest();
	};

	// Ajax Get
	Lea.get = function (url, options) {
		return Lea.ajax( url, Lea.extend(options || {}, {method: "GET"}) );
	};

	Lea.post = function (url, data, options) {
		return Lea.ajax( url, Lea.extend(options || {}, {method: "POST", data: data || {}}) );
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

			/*var getPrefixedProp = function (prop) {
				var
					div = document.createElement("div"),
					pre = ["Webkit", "O", "MS", "Moz"];
				
				prop = Lea.camelize(prop);

				if (prop in div.style) {
					return prop;
				} else {
					var prefixedProp = prop;

					pre.forEach(function (prefix) {
						prefixedProp = prefix + prop;

						if (prefixedProp in div) {
							prop = prefixedProp;
							throw StopIteration;
						}
					});

					return prefixedProp;
				}
			};*/

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

		// Get scroll offsets
		scroll: function () {
			var element = this.elements[0];

			return {
				'top': element.scrollTop,
				'left': element.scrollLeft,
				'width': element.scrollWidth,
				'height': element.scrollHeight
			};
		},

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

		delegate: function (selector, event, fn) {
			this.each(function (){
				this.addEventListener(event, function (evt) {
					if ( Lea(evt.target).is(selector) ) {
						fn.call(evt.target, event);
					}
				}, false );
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
				//return (element.matches || element.matchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.webkitMatchesSelector || element.oMatchesSelector).call(element, selector);
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

				if (field.name && !field.disabled && (["file", "button", "reset", "submit"]).indexOf(field.type) == -1) {
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
				data: this.serialize()
			}, options || {});

			return Lea.ajax( form.action || "#", options );
		}
	};

	console.info("Powered by Lea.js" + "\n" + "Version: " + Lea.about.version + "\n" + "Homepage:" + Lea.about.homepage);

	return Lea;

}));