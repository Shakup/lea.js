(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["lea"] = factory();
	else
		root["lea"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.default = lea;
	
	var _Lea = __webpack_require__(1);
	
	var _Lea2 = _interopRequireDefault(_Lea);
	
	var _Utils = __webpack_require__(2);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	var _Cookie = __webpack_require__(3);
	
	var _Cookie2 = _interopRequireDefault(_Cookie);
	
	var _Device = __webpack_require__(4);
	
	var _Device2 = _interopRequireDefault(_Device);
	
	var _HttpRequest = __webpack_require__(5);
	
	var _HttpRequest2 = _interopRequireDefault(_HttpRequest);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function lea(query, context) {
	   return new _Lea2.default(query, context || document);
	}
	
	/* ==========================================================================
	   Utils
	   ========================================================================== */
	
	Object.keys(_Utils2.default).forEach(function (key) {
	   return lea[key] = _Utils2.default[key];
	});
	
	/* ==========================================================================
	   Cookies
	   ========================================================================== */
	
	lea.cookie = _Cookie2.default;
	
	/* ==========================================================================
	   Mobile detection
	   ========================================================================== */
	
	lea.device = _Device2.default;
	lea.isMobile = function () {
	   return !lea.device('desktop');
	};
	
	/* ==========================================================================
	   Asynchronous Https Requests
	   ========================================================================== */
	
	lea.ajax = function (url, options) {
	   return new _HttpRequest2.default(url, options);
	};
	
	lea.get = function (url, options) {
	   return lea.ajax(url, lea.extend(options || {}, { method: 'GET' }));
	};
	
	lea.post = function (url, data, options) {
	   return lea.ajax(url, lea.extend(options || {}, { method: 'POST', data: data || {} }));
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Lea = function () {
		function Lea(query, context) {
			_classCallCheck(this, Lea);
	
			if (lea.type(query) != 'array') query = [query];
	
			this.elements = query.map(function (obj) {
	
				if (lea.type(obj) == 'node' || obj === window || obj === document) {
					return obj;
				} else if (lea.type(obj) === 'string') {
					return Array.from(context.querySelectorAll(obj));
				} else return null;
			});
	
			this.elements = [].concat.apply([], this.elements).filter(Boolean);
			this.length = this.elements.length;
	
			return this;
		}
	
		_createClass(Lea, [{
			key: 'each',
			value: function each(action) {
				var response = void 0,
				    BreakException = function BreakException() {};
	
				try {
					this.elements.forEach(function (element, index) {
						response = action.call(element, element, index);
						if (response === false) throw BreakException;
					});
				} catch (e) {
					if (e !== BreakException) throw e;
				}
	
				return this;
			}
		}, {
			key: 'get',
			value: function get(index) {
				return index !== undefined ? this.elements[index] || null : this.elements;
			}
		}, {
			key: 'addClass',
			value: function addClass(klass) {
				this.each(function (element) {
					return element.classList.add(klass);
				});
				return this;
			}
		}, {
			key: 'removeClass',
			value: function removeClass(klass) {
				this.each(function (element) {
					return element.classList.remove(klass);
				});
				return this;
			}
		}, {
			key: 'hasClass',
			value: function hasClass(klass) {
				var bool = true;
	
				this.elements.forEach(function (element) {
					if (!element.classList.contains(klass)) {
						bool = false;
						return false;
					}
				});
	
				return bool;
			}
		}, {
			key: 'toggleClass',
			value: function toggleClass(klass) {
				this.each(function (element) {
					return element.classList.toggle(klass);
				});
				return this;
			}
		}, {
			key: 'show',
			value: function show(display) {
				if (!display) display = 'block';
	
				this.each(function (element) {
					return element.style.display = display;
				});
	
				return this;
			}
		}, {
			key: 'hide',
			value: function hide() {
				this.each(function (element) {
					return element.style.display = 'none';
				});
				return this;
			}
		}, {
			key: 'toggle',
			value: function toggle(display) {
				if (!display) display = 'block';
	
				this.each(function (element) {
					return element.style.display = element.style.display == 'none' ? display : 'none';
				});
	
				return this;
			}
		}, {
			key: 'html',
			value: function html(src) {
				if (!src) {
					return this.get(0).innerHTML;
				} else {
					this.each(function (element) {
						return element.innerHTML = src;
					});
					return this;
				}
			}
		}, {
			key: 'on',
			value: function on(events, fn) {
				var tabevts = events.split(' ');
	
				this.each(function (element) {
					tabevts.forEach(function (event) {
						return element.addEventListener(event, fn, false);
					});
				});
	
				return this;
			}
		}, {
			key: 'off',
			value: function off(events, fn) {
				var tabevts = events.split(' ');
	
				this.each(function (element) {
					tabevts.forEach(function (event) {
						return element.removeEventListener(event, fn, false);
					});
				});
	
				return this;
			}
		}, {
			key: 'delegate',
			value: function delegate(selector, events, fn) {
				var tabevts = events.split(' ');
	
				this.each(function (element) {
					tabevts.forEach(function (event) {
						element.addEventListener(event, function (evt) {
							if (lea(evt.target).is(selector)) fn.call(evt.target, event);
						}, false);
					});
				});
	
				return this;
			}
		}, {
			key: 'trigger',
			value: function trigger(event) {
				var evt = document.createEvent('HTMLEvents');
	
				evt.initEvent(event, true, true);
	
				this.each(function (element) {
					return element.dispatchEvent(evt);
				});
	
				return this;
			}
		}, {
			key: 'click',
			value: function click(fn) {
				return this.on('click', fn);
			}
		}, {
			key: 'attr',
			value: function attr(_attr, val) {
				if (val !== undefined) {
					this.each(function (element) {
						return element.setAttribute(_attr, val);
					});
					return this;
				} else {
					return this.elements[0].getAttribute(_attr);
				}
			}
		}, {
			key: 'removeAttr',
			value: function removeAttr(attr) {
				this.each(function (element) {
					return element.removeAttribute(attr);
				});
				return this;
			}
		}, {
			key: 'data',
			value: function data(_data, value) {
				if (value !== undefined) {
					this.each(function (element) {
						return element.dataset[_data] = value;
					});
					return this;
				} else {
					return this.get(0).dataset[_data];
				}
			}
		}, {
			key: 'removeData',
			value: function removeData(data) {
				var _this = this;
	
				this.each(function (element) {
					return delete _this.dataset[data];
				});
				return this;
			}
		}, {
			key: 'append',
			value: function append(obj) {
				this.each(function (element) {
	
					if (lea.type(obj) == 'node') {
						element.appendChild(obj);
					} else {
						var nodes = lea.str2Node(obj);
						nodes.forEach(function (node) {
							return element.appendChild(node);
						});
					}
				});
	
				return this;
			}
		}, {
			key: 'prepend',
			value: function prepend(obj) {
				this.each(function (element) {
	
					if (lea.type(obj) == 'node') {
						element.insertBefore(obj, element.firstChild);
					} else {
						var nodes = lea.str2Node(obj);
						nodes.forEach(function (node) {
							return element.insertBefore(node, element.firstChild);
						});
					}
				});
	
				return this;
			}
		}, {
			key: 'before',
			value: function before(obj) {
				this.each(function (element) {
					return element.insertAdjacentHTML('beforebegin', obj);
				});
				return this;
			}
		}, {
			key: 'after',
			value: function after(obj) {
				this.each(function (element) {
					return element.insertAdjacentHTML('afterend', obj);
				});
				return this;
			}
		}, {
			key: 'remove',
			value: function remove() {
				var _this2 = this;
	
				this.each(function (element) {
					return element.parentNode.removeChild(_this2);
				});
				return this;
			}
		}, {
			key: 'parent',
			value: function parent() {
				var _this3 = this;
	
				var parents = [];
	
				this.each(function (element) {
					var parent = _this3.parentNode;
					if (parent) parents.push(parent);
				});
	
				return lea(parents);
			}
		}, {
			key: 'find',
			value: function find(selector) {
				var found = [];
	
				this.each(function (element) {
					found = found.concat(lea.toArray(element.querySelectorAll(selector)));
				});
	
				return lea(found);
			}
		}, {
			key: 'prev',
			value: function prev() {
				var previous = [];
	
				this.each(function (element) {
					var prev = element.previousElementSibling;
					if (prev) previous.push(prev);
				});
	
				return lea(previous);
			}
		}, {
			key: 'next',
			value: function next() {
				var next = [];
	
				this.each(function (element) {
					var nex = element.nextElementSibling;
					if (nex) next.push(nex);
				});
	
				return lea(next);
			}
		}, {
			key: 'clear',
			value: function clear() {
				this.each(function (element) {
					return element.innerHTML = '';
				});
				return this;
			}
		}, {
			key: 'is',
			value: function is(selector) {
				var flag = true,
				    matches = function matches(element) {
					return (element.matches || element.matchesSelector || element.msMatchesSelector || element.webkitMatchesSelector).call(element, selector);
				};
	
				this.each(function (element) {
					if (!matches(element)) {
						flag = false;
						return false;
					}
				});
	
				return flag;
			}
		}, {
			key: 'offset',
			value: function offset() {
				if (!this.length) return { top: 0, left: 0 };
	
				var element = this.elements[0],
				    rect = element.getBoundingClientRect();
	
				return {
					top: rect.top + document.body.scrollTop,
					left: rect.left + document.body.scrollLeft
				};
			}
		}, {
			key: 'position',
			value: function position() {
				if (!this.length) return { top: 0, left: 0 };
	
				var rect = this.elements[0].getBoundingClientRect();
	
				return {
					top: rect.top,
					left: rect.left
				};
			}
		}, {
			key: 'replaceWith',
			value: function replaceWith(html) {
				this.each(function (element) {
					return element.outerHTML = html;
				});
				return this;
			}
		}, {
			key: 'serialize',
			value: function serialize() {
				var form = this.elements[0],
				    serial = {},
				    l = void 0,
				    j = void 0;
	
				if (form.nodeName.toLowerCase() !== 'form') return serial;
	
				lea.toArray(form.elements).forEach(function (field) {
	
					if (field.name && ['file', 'button', 'reset', 'submit'].indexOf(field.type) == -1) {
						if (field.type == 'select-multiple') {
							l = form.elements[i].options.length;
	
							for (j = 0; j < l; j++) {
								if (field.options[j].selected) {
									serial[field.name] = field.options[j].value;
								}
							}
						} else if (field.type != 'checkbox' && field.type != 'radio' || field.checked) {
							serial[field.name] = field.value;
						}
					}
				});
	
				return serial;
			}
		}, {
			key: 'submit',
			value: function submit(options) {
				var form = this.elements[0];
	
				if (form.nodeName.toLowerCase() !== 'form') return false;
	
				options = lea.extend({
					method: form.method || 'GET',
					data: lea(form).serialize()
				}, options || {});
	
				return lea.ajax(form.action || '#', options);
			}
		}, {
			key: 'style',
			value: function style(props, value) {
	
				function compute(val) {
					if (!val) return '';
	
					if (val.match(/^rgba\(0\,\s?0\,\s?0\,\s?0\)$/g)) {
						return 'transparent';
					}
	
					var hex = lea.rgb2Hex(val);
	
					if (hex) {
						return hex;
					} else return val;
				}
	
				var propsType = lea.type(props);
	
				if ('string' == propsType && !value) {
					return compute(window.getComputedStyle(this.get(0))[lea.camelcase(props)]);
				}
	
				if ('string' == propsType && 'string' == lea.type(value)) {
					this.each(function (element) {
						return element.style[lea.camelcase(props)] = value;
					});
				}
	
				if ('object' == propsType && !value) {
					this.each(function (element) {
						lea.parse(props, function (key, val) {
							return element.style[lea.camelcase(key)] = val;
						});
					});
				}
	
				return this;
			}
		}]);
	
		return Lea;
	}();
	
	exports.default = Lea;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.default = {
		parse: function parse(obj, fn, context) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					fn.call(context || obj, key, obj[key]);
				}
			}
		},
		extend: function extend(obj) {
			if (!obj) obj = {};
	
			for (var i = 1; i < arguments.length; i++) {
				if (!arguments[i]) continue;
	
				lea.parse(arguments[i], function (key, val) {
					return obj[key] = val;
				});
			}
	
			return obj;
		},
		type: function type(obj) {
			return Array.isArray(obj) ? 'array' : obj instanceof HTMLElement ? 'node' : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
		},
		ready: function ready(fn) {
			if (document.readyState !== 'loading') fn();else document.addEventListener('DOMContentLoaded', fn);
		},
		str2Node: function str2Node(str) {
			var div = document.createElement('div');
			div.innerHTML = str;
			return Array.prototype.slice.call(div.childNodes, 0);
		},
		debounce: function debounce(fn, delay) {
			var timer = void 0;
	
			return function () {
				var args = arguments,
				    context = this;
	
				clearTimeout(timer);
	
				timer = setTimeout(function () {
					return fn.apply(context, args);
				}, delay);
			};
		},
		throttle: function throttle(fn, delay) {
			var last = void 0,
			    timer = void 0;
	
			return function () {
				var context = this,
				    now = +new Date(),
				    args = arguments;
	
				if (last && now < last + delay) {
	
					clearTimeout(timer);
	
					timer = setTimeout(function () {
						last = now;
						fn.apply(context, args);
					}, delay);
				} else {
					last = now;
					fn.apply(context, args);
				}
			};
		},
		slugify: function slugify(str) {
			str = str.replace(/^\s+|\s+$/g, '').toLowerCase();
	
			var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;',
			    to = 'aaaaeeeeiiiioooouuuunc------';
	
			for (var i = 0, l = from.length; i < l; i++) {
				str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
			}str = str.replace(/\./g, '-').replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
	
			return str;
		},
		camelcase: function camelcase(str) {
			return lea.lcFirst(lea.slugify(str).replace(/(?:^|\-)(\w)/g, function (_, c) {
				return c ? c.toUpperCase() : '';
			}));
		},
		kebabcase: function kebabcase(str) {
			return lea.slugify(str).replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, function (match) {
				return '-' + match.toLowerCase();
			});
		},
		ucFirst: function ucFirst(str) {
			return str.charAt(0).toUpperCase() + str.slice(1);
		},
		lcFirst: function lcFirst(str) {
			return str.charAt(0).toLowerCase() + str.slice(1);
		},
		rgb2Hex: function rgb2Hex(rgb) {
			rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	
			return rgb && rgb.length == 4 ? '#' + ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) + ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) + ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
		},
		lpad: function lpad(str, size) {
			var chr = arguments.length <= 2 || arguments[2] === undefined ? ' ' : arguments[2];
	
			str = str + '';
			return str.length >= size ? str : new Array(size - str.length + 1).join(chr) + str;
		},
		rpad: function rpad(str, size) {
			var chr = arguments.length <= 2 || arguments[2] === undefined ? ' ' : arguments[2];
	
			str = str + '';
			return str.length >= size ? str : str + new Array(size - str.length + 1).join(chr);
		}
	};
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		get: function get(key) {
			if (!key) return null;
	
			return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
		},
		set: function set(key, value, vEnd, sPath, sDomain, bSecure) {
			if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) return false;
	
			var sExpires = '';
	
			if (vEnd) {
				switch (vEnd.constructor) {
					case Number:
						sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
						break;
					case String:
						sExpires = '; expires=' + vEnd;
						break;
					case Date:
						sExpires = '; expires=' + vEnd.toUTCString();
						break;
				}
			}
	
			document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
	
			return true;
		},
		remove: function remove(key, sPath, sDomain) {
			if (!this.exists(key)) return false;
	
			document.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '');
	
			return true;
		},
		exists: function exists(key) {
			if (!key) return false;
	
			return new RegExp('(?:^|;\\s*)' + encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=').test(document.cookie);
		},
		keys: function keys() {
			var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
	
			for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
				aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
			}
	
			return aKeys;
		}
	};
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (type) {
		var ua = navigator.userAgent.toLowerCase(),
		    device = function () {
			if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) return 'tablet';else if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(ua)) return 'phone';else return 'desktop';
		}();
	
		return type ? device === type : device;
	};
	
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var HttpRequest = function () {
		function HttpRequest(url, options) {
			_classCallCheck(this, HttpRequest);
	
			var cb = function cb() {},
			    self = this;
	
			this.options = lea.extend({
				method: 'GET',
				always: cb,
				then: cb,
				catch: cb,
				change: cb,
				send: true,
				async: true,
				data: {},
				withCredentials: false,
				contentType: 'application/x-www-form-urlencoded'
			}, options || {});
	
			this.transport = new XMLHttpRequest();
			this.options.method = this.options.method.toUpperCase();
			this.parameters = '';
	
			this.transport.onreadystatechange = function () {
	
				self.options.change.call(this);
	
				if (this.readyState == 4) {
	
					self.options.always.call(this);
	
					if (this.status === 200 || this.status === 0) {
	
						var responseContentType = this.getResponseHeader('Content-Type'),
						    response = void 0;
	
						if (responseContentType && responseContentType.indexOf('application/json') > -1) response = JSON.parse(this.responseText);else response = this.responseText;
	
						self.options.then.call(this, response);
					} else {
						self.options.catch.call(this);
					}
				}
			};
	
			this.transport.withCredentials = this.options.withCredentials;
	
			this.transport.open(this.options.method, url, this.options.async);
	
			this.transport.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	
			if (this.options.method == 'POST') {
				this.transport.setRequestHeader('Content-Type', this.options.contentType);
	
				lea.parse(this.options.data, function (key, val) {
					if (self.parameters.length) self.parameters += '&';
					self.parameters += encodeURIComponent(key) + '=' + encodeURIComponent(val);
				});
			}
	
			if (this.options.send) this.send();
		}
	
		_createClass(HttpRequest, [{
			key: 'always',
			value: function always(cb) {
				this.options.always = cb;
				return this;
			}
		}, {
			key: 'change',
			value: function change(cb) {
				this.options.change = cb;
				return this;
			}
		}, {
			key: 'then',
			value: function then(cb) {
				this.options.then = cb;
				return this;
			}
		}, {
			key: 'catch',
			value: function _catch(cb) {
				this.options.catch = cb;
				return this;
			}
		}, {
			key: 'send',
			value: function send() {
				this.transport.send(this.parameters.length ? this.parameters : null);
				return this;
			}
		}, {
			key: 'abort',
			value: function abort() {
				this.transport.abort();
				return this;
			}
		}]);
	
		return HttpRequest;
	}();
	
	exports.default = HttpRequest;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=lea.js.map