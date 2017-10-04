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

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	var _Lea = __webpack_require__(2);
	
	var _Lea2 = _interopRequireDefault(_Lea);
	
	var _Utils = __webpack_require__(3);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	var _Cookie = __webpack_require__(4);
	
	var _Cookie2 = _interopRequireDefault(_Cookie);
	
	var _Device = __webpack_require__(5);
	
	var _Device2 = _interopRequireDefault(_Device);
	
	var _HttpRequest = __webpack_require__(6);
	
	var _HttpRequest2 = _interopRequireDefault(_HttpRequest);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var lea = function lea(query) {
	   var context = arguments.length <= 1 || arguments[1] === undefined ? document : arguments[1];
	   return new _Lea2.default(query, context);
	};
	
	/* ==========================================================================
	   Utils
	   ========================================================================== */
	
	Object.assign(lea, _Utils2.default);
	
	/* ==========================================================================
	   Cookies
	   ========================================================================== */
	
	lea.cookie = _Cookie2.default;
	
	/* ==========================================================================
	   Mobile Detection
	   ========================================================================== */
	
	lea.device = _Device2.default;
	lea.isMobile = function () {
	   return !lea.device('desktop');
	};
	
	/* ==========================================================================
	   Asynchronous Https Requests
	   ========================================================================== */
	
	lea.ajax = function (options) {
	   return new _HttpRequest2.default(options);
	};
	
	lea.get = function (url) {
	   var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	   return lea.ajax(Object.assign(options, { method: 'GET', url: url }));
	};
	
	lea.post = function (url) {
	   var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	   var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	   return lea.ajax(Object.assign(options, { method: 'POST', data: data, url: url }));
	};
	
	exports.default = lea;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _lea = __webpack_require__(1);
	
	var _lea2 = _interopRequireDefault(_lea);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Lea = function () {
		function Lea(query) {
			var context = arguments.length <= 1 || arguments[1] === undefined ? document : arguments[1];
	
			_classCallCheck(this, Lea);
	
			if (_lea2.default.type(query) != 'array') query = [query];
	
			this.elements = query.map(function (obj) {
	
				if (_lea2.default.type(obj) == 'node' || obj === window || obj === document) {
					return obj;
				} else if (_lea2.default.type(obj) === 'string') {
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
			value: function get() {
				var index = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
	
				return index !== undefined ? this.elements[index] : this.elements;
			}
		}, {
			key: 'addClass',
			value: function addClass() {
				var _this = this;
	
				for (var _len = arguments.length, classes = Array(_len), _key = 0; _key < _len; _key++) {
					classes[_key] = arguments[_key];
				}
	
				classes.forEach(function (klass) {
					_this.each(function (element) {
						return element.classList.add(klass);
					});
				});
				return this;
			}
		}, {
			key: 'removeClass',
			value: function removeClass() {
				var _this2 = this;
	
				for (var _len2 = arguments.length, classes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					classes[_key2] = arguments[_key2];
				}
	
				classes.forEach(function (klass) {
					_this2.each(function (element) {
						return element.classList.remove(klass);
					});
				});
				return this;
			}
		}, {
			key: 'hasClass',
			value: function hasClass() {
				var klass = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	
				var bool = true;
	
				this.each(function (element) {
					if (!element.classList.contains(klass)) {
						bool = false;
						return false;
					}
				});
	
				return bool;
			}
		}, {
			key: 'toggleClass',
			value: function toggleClass() {
				var klass = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	
				this.each(function (element) {
					return element.classList.toggle(klass);
				});
				return this;
			}
		}, {
			key: 'show',
			value: function show() {
				var display = arguments.length <= 0 || arguments[0] === undefined ? 'block' : arguments[0];
	
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
			value: function toggle() {
				var display = arguments.length <= 0 || arguments[0] === undefined ? 'block' : arguments[0];
	
				this.each(function (element) {
					var element_display = (0, _lea2.default)(element).style('display');
					element.style.display = element_display == 'none' ? display : 'none';
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
							if ((0, _lea2.default)(evt.target).is(selector)) fn.call(evt.target, event);
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
			key: 'focus',
			value: function focus() {
				this.elements[0].focus();
				return this;
			}
		}, {
			key: 'select',
			value: function select() {
				var element = this.elements[0];
	
				if ('setSelectionRange' in element) {
					if (!(0, _lea2.default)(element).is(':focus')) {
						element.focus();
					}
					element.setSelectionRange(0, element.value.length);
				}
	
				return this;
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
				var _this3 = this;
	
				this.each(function () {
					return delete _this3.dataset[data];
				});
				return this;
			}
		}, {
			key: 'append',
			value: function append(obj) {
				this.each(function (element) {
	
					if (_lea2.default.type(obj) == 'node') {
						element.appendChild(obj);
					} else {
						var nodes = _lea2.default.str2Node(obj);
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
	
					if (_lea2.default.type(obj) == 'node') {
						element.insertBefore(obj, element.firstChild);
					} else {
						var nodes = _lea2.default.str2Node(obj);
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
				this.each(function (element) {
					return element.parentNode.removeChild(element);
				});
				return this;
			}
		}, {
			key: 'parent',
			value: function parent(tag) {
				var parents = [];
	
				this.each(function (element) {
					var parent = element.parentNode;
	
					if (parent) {
						if (tag !== undefined) {
							while (parent && parent.tagName.toLowerCase() != tag.toLowerCase()) {
								parent = parent.parentNode;
							}
						}
						parents.push(parent);
					}
				});
	
				return (0, _lea2.default)(parents);
			}
		}, {
			key: 'find',
			value: function find(selector) {
				var found = [];
	
				this.each(function (element) {
					found = found.concat(Array.from(element.querySelectorAll(selector)));
				});
	
				return (0, _lea2.default)(found);
			}
		}, {
			key: 'prev',
			value: function prev() {
				var previous = [];
	
				this.each(function (element) {
					var prev = element.previousElementSibling;
					if (prev) previous.push(prev);
				});
	
				return (0, _lea2.default)(previous);
			}
		}, {
			key: 'next',
			value: function next() {
				var next = [];
	
				this.each(function (element) {
					var nex = element.nextElementSibling;
					if (nex) next.push(nex);
				});
	
				return (0, _lea2.default)(next);
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
			value: function is() {
				var selector = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	
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
			key: 'scroll',
			value: function scroll() {
				if (!this.length) return { top: 0, left: 0 };
	
				var element = this.elements[0];
	
				if (element == document || element == window) {
					return {
						top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
						left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
					};
				}
			}
		}, {
			key: 'offset',
			value: function offset() {
				var element = this.elements[0],
				    rect = element.getBoundingClientRect(),
				    scroll = (0, _lea2.default)(document).scroll();
	
				return {
					top: rect.top + scroll.top,
					left: rect.left + scroll.left
				};
			}
		}, {
			key: 'position',
			value: function position() {
				var rect = this.elements[0].getBoundingClientRect();
	
				return {
					top: rect.top,
					left: rect.left
				};
			}
		}, {
			key: 'replaceWith',
			value: function replaceWith() {
				var html = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	
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
	
				Array.from(form.elements).forEach(function (field, i) {
	
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
			value: function submit() {
				var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
				var form = this.elements[0];
	
				if (form.nodeName.toLowerCase() !== 'form') return false;
	
				options = _lea2.default.extend({
					method: form.method || 'GET',
					data: (0, _lea2.default)(form).serialize()
				}, options);
	
				return _lea2.default.ajax(form.action || '#', options);
			}
		}, {
			key: 'val',
			value: function val() {
				var value = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
	
				if (!value) {
					return this.get(0).value || '';
				} else {
					this.each(function (element) {
						return element.value = value;
					});
					return this;
				}
			}
		}, {
			key: 'style',
			value: function style(props, value) {
				var _this4 = this;
	
				function compute(val) {
					if (!val) return '';
	
					if (val.match(/^rgba\(0\,\s?0\,\s?0\,\s?0\)$/g)) {
						return 'transparent';
					}
	
					var hex = _lea2.default.rgb2Hex(val);
	
					if (hex) {
						return hex;
					} else return val;
				}
	
				var propsType = _lea2.default.type(props);
	
				if ('string' == propsType && !value) {
					return compute(window.getComputedStyle(this.get(0))[_lea2.default.prefix(props)]);
				}
	
				if ('string' == propsType && 'string' == _lea2.default.type(value)) {
					this.each(function (element) {
						return element.style[_lea2.default.prefix(props)] = value;
					});
				}
	
				if ('object' == propsType && !value) {
					(function () {
						var prefixed_props = {};
	
						Object.keys(props).forEach(function (prop) {
							return prefixed_props[_lea2.default.prefix(_lea2.default.kebabcase(prop))] = props[prop];
						});
	
						_this4.each(function (element) {
							Object.keys(prefixed_props).forEach(function (prop) {
								return element.style[prop] = prefixed_props[prop];
							});
						});
					})();
				}
	
				return this;
			}
		}]);
	
		return Lea;
	}();
	
	exports.default = Lea;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _lea = __webpack_require__(1);
	
	var _lea2 = _interopRequireDefault(_lea);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
		parse: function parse(obj, fn, context) {
			Object.keys(obj).forEach(function (key) {
				fn.call(context || obj, key, obj[key]);
			});
		},
		extend: function extend(obj) {
			if (!obj) obj = {};
	
			for (var i = 1; i < arguments.length; i++) {
				if (!arguments[i]) continue;
	
				_lea2.default.parse(arguments[i], function (key, val) {
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
			if (!str) return [];
			if (_lea2.default.type == 'node') return str;
	
			var regSingleTag = /^<([a-z][^\/\0>: \x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?: <\/\1>|)$/i,
			    isSingleTag = regSingleTag.exec(str),
			    nodes = void 0;
	
			if (isSingleTag) {
				var div = document.createElement('div');
				div.innerHTML = str;
				nodes = div.children;
			} else {
				var doc = new DOMParser().parseFromString(str, 'text/html');
				nodes = doc.body.children;
			}
	
			return Array.from(nodes);
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
			return _lea2.default.lcFirst(_lea2.default.slugify(str).replace(/(?:^|\-)(\w)/g, function (_, c) {
				return c ? c.toUpperCase() : '';
			}));
		},
		kebabcase: function kebabcase(str) {
			return _lea2.default.slugify(str).replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, function (match) {
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
		},
		prefix: function prefix(prop) {
			var styles = document.body ? document.body.style : document.createElement('div').style,
			    prefixes = ['moz', 'Moz', 'webkit', 'Webkit', 'ms', 'o'],
			    output = this.camelcase(prop);
	
			if (output in styles) return output;
	
			prop = this.ucFirst(output);
	
			prefixes.some(function (prefix) {
				if (prefix + prop in styles) {
					output = prefix + prop;
					return true;
				}
				return false;
			});
	
			return output;
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
/* 5 */
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _lea = __webpack_require__(1);
	
	var _lea2 = _interopRequireDefault(_lea);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var HttpRequest = function () {
		function HttpRequest() {
			var _this = this;
	
			var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
			_classCallCheck(this, HttpRequest);
	
			var cb = function cb() {},
			    self = this;
	
			this.options = Object.assign({
				url: '',
				method: 'GET',
				always: cb,
				onComplete: cb,
				onError: cb,
				onChange: cb,
				send: true,
				async: true,
				data: {},
				headers: {},
				withCredentials: false,
				sendRequestHeaders: true,
				contentType: 'application/x-www-form-urlencoded'
			}, options);
	
			this.transport = new XMLHttpRequest();
			this.options.method = this.options.method.toUpperCase();
			this.parameters = '';
	
			this.transport.onreadystatechange = function () {
				self.options.onChange(self.transport);
	
				if (this.readyState == 4) {
	
					self.options.always(self.transport);
	
					if (this.status === 200) {
						var responseContentType = this.getResponseHeader('Content-Type'),
						    response = void 0;
	
						if (responseContentType && responseContentType.indexOf('application/json') > -1) response = JSON.parse(this.responseText);else response = this.responseText;
	
						self.options.onComplete(response, self.transport);
					} else {
						self.options.onError(self.transport);
					}
				}
			};
	
			this.transport.withCredentials = this.options.withCredentials;
	
			this.transport.open(this.options.method, this.options.url, this.options.async);
	
			if (this.options.sendRequestHeaders) {
				this.transport.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	
				_lea2.default.parse(this.options.headers, function (key, val) {
					_this.transport.setRequestHeader(key, val);
				});
	
				this.transport.setRequestHeader('Content-Type', this.options.contentType);
			}
	
			if (Object.keys(this.options.data).length) {
				_lea2.default.parse(this.options.data, function (key, val) {
					if (_this.parameters.length) _this.parameters += '&';
					_this.parameters += encodeURIComponent(key) + '=' + encodeURIComponent(val);
				});
			}
	
			if (this.options.send) this.send();
	
			return this;
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
				this.options.onChange = cb;
				return this;
			}
		}, {
			key: 'then',
			value: function then(cb) {
				this.options.onComplete = cb;
				return this;
			}
		}, {
			key: 'catch',
			value: function _catch(cb) {
				this.options.onError = cb;
				return this;
			}
		}, {
			key: 'send',
			value: function send() {
				var obj = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
	
				this.transport.send(this.parameters.length ? this.parameters : obj);
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