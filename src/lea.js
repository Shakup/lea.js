import Lea from './inc/Lea'


export default function lea (query, context) {
	return new Lea( query, context || document )
}

lea.parse = (obj, fn, context) => {
	for ( var key in obj ) {
		if ( obj.hasOwnProperty(key) ) {
			fn.call( context || obj, key, obj[key] )
		}
	}
}

lea.extend = function (obj) {
	if ( !obj ) obj = {}

	for ( var i = 1; i < arguments.length; i++ ) {
		if (!arguments[i]) continue

		lea.parse( arguments[i], (key, val) => obj[key] = val )
	}

	return obj
}

lea.type = (obj) => {
	return Array.isArray(obj) ? 'array' : obj instanceof HTMLElement ? 'node' : typeof obj
}

lea.ready = (fn) => {
	if ( document.readyState !== 'loading' )
		fn()
	else
		document.addEventListener( 'DOMContentLoaded', fn )
}

lea.str2Node = (str) => {
	let div = document.createElement("div")
	div.innerHTML = str
	return Array.prototype.slice.call( div.childNodes, 0 )
}


/* ==========================================================================
   Cookies
   ========================================================================== */

import Cookie from './inc/Cookie'

lea.cookie = Cookie


/* ==========================================================================
   Mobile detection
   ========================================================================== */

import Device from './inc/Device'

lea.device = Device
lea.isMobile = () => !lea.device('desktop')


/* ==========================================================================
   Debounce & Throttle
   ========================================================================== */

lea.debounce = (fn, delay) => {
	let timer
	
	return function () {
		var
			args      = arguments
			, context = this
	
		clearTimeout(timer)
		
		timer = setTimeout( () => fn.apply( context, args ), delay )
	}
}

lea.throttle = (fn, delay) => {
	let last, timer
	
	return function () {
		let
			context = this
			, now   = +new Date()
			, args  = arguments
		
		if ( last && now < last + delay ) {
			
			clearTimeout(timer)

			timer = setTimeout(function () {
				last = now
				fn.apply( context, args )
			}, delay)

		} else {
			last = now
			fn.apply( context, args )
		}
	}
}


/* ==========================================================================
   Asynchronous Https Requests
   ========================================================================== */

import HttpRequest from './inc/HttpRequest'

lea.ajax = (url, options) => {
	return new HttpRequest( url, options )
}

lea.get = (url, options) => {
	return lea.ajax( url, lea.extend( options || {}, {method: 'GET'} ) )
}

lea.post = (url, data, options) => {
	return lea.ajax( url, lea.extend( options || {}, {method: 'POST', data: data || {}} ) )
}
