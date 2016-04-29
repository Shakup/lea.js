'use strict'

const
	LeaClass = require('./imports/lea.class')

/* ==========================================================================
   Main function
   ========================================================================== */

function Lea (query, context) {
	return new LeaClass( query, context || document )
}


/* ==========================================================================
   Usefull methods
   ========================================================================== */

Lea.parse = (obj, fn, context) => {
	for ( var key in obj ) {
		if ( obj.hasOwnProperty(key) ) {
			fn.call( context || obj, key, obj[key] )
		}
	}
}

Lea.extend = function (obj) {
	if ( !obj ) obj = {}

	for ( var i = 1; i < arguments.length; i++ ) {
		if (!arguments[i]) continue

		Lea.parse( arguments[i], (key, val) => obj[key] = val )
	}

	return obj
}

Lea.type = (obj) => {
	return Array.isArray(obj) ? 'array' : obj instanceof HTMLElement ? 'node' : typeof obj
}

Lea.ready = (fn) => {
	if ( document.readyState !== 'loading' )
		fn()
	else
		document.addEventListener( 'DOMContentLoaded', fn )
}

Lea.str2Node = (str) => {
	let div = document.createElement("div")
	div.innerHTML = str
	return Array.prototype.slice.call( div.childNodes, 0 )
}


/* ==========================================================================
   Cookies
   ========================================================================== */

Lea.cookie = {
	get: (key) => {
		if (!key) return null
		
		return decodeURIComponent( document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1') ) || null
	},

	set: (key, value, vEnd, sPath, sDomain, bSecure) => {
		if ( !key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key) ) return false
		
		let sExpires = ''
		
		if (vEnd) {
			switch (vEnd.constructor) {
				case Number:
					sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd
				break;
				case String:
					sExpires = '; expires=' + vEnd
				break;
				case Date:
					sExpires = '; expires=' + vEnd.toUTCString()
				break;
			}
		}

		document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value) + sExpires + ( sDomain ? '; domain=' + sDomain : '' ) + ( sPath ? '; path=' + sPath : '' ) + ( bSecure ? '; secure' : '' )
		
		return true
	},

	remove: (key, sPath, sDomain) => {
		if ( !this.exists(key) ) return false
		
		document.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + ( sDomain ? '; domain=' + sDomain : '' ) + ( sPath ? '; path=' + sPath : '' )
		
		return true
	},

	exists: (key) => {
		if (!key) return false

		return ( new RegExp( '(?:^|;\\s*)' + encodeURIComponent(key).replace( /[\-\.\+\*]/g, '\\$&' ) + '\\s*\\=' ) ).test( document.cookie )
	},

	keys: () => {
		let aKeys = document.cookie.replace( /((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '' ).split( /\s*(?:\=[^;]*)?;\s*/ )

		for ( let nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++ ) {
			aKeys[nIdx] = decodeURIComponent(aKeys[nIdx])
		}

		return aKeys
	}
}


/* ==========================================================================
   Mobile detection
   ========================================================================== */

Lea.device = (type) => {
	let
		ua       = navigator.userAgent.toLowerCase()
		, device = (function () {
			if ( /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua) )
				return 'tablet'
			else if ( /(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(ua) )
				return 'phone'
			else
				return 'desktop'
		})()

	return type ? (device === type) : device
};

Lea.isMobile = () => !Lea.device('desktop')


/* ==========================================================================
   Debounce & Throttle
   ========================================================================== */

Lea.debounce = (fn, delay) => {
	let timer
	
	return function () {
		var
			args      = arguments
			, context = this
	
		clearTimeout(timer)
		
		timer = setTimeout( () => fn.apply( context, args ), delay )
	}
}

Lea.throttle = (fn, delay) => {
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

class HttpRequest {

	constructor (url, options) {
		let
			cb     = function(){}
			, self = this

		this.options = Lea.extend({
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
		}, options || {})

		this.transport      = new XMLHttpRequest()
		this.options.method = this.options.method.toUpperCase()
		this.parameters     = ''

		this.transport.onreadystatechange = function () {

			this.options.change.call( this )

			if (this.readyState == 4) {

				self.options.always.call( this )
				
				if (this.status === 200 || this.status === 0) {

					let
						responseContentType = this.getResponseHeader('Content-Type')
						, response

					if ( responseContentType && responseContentType.indexOf('application/json') > -1 )
						response = JSON.parse( this.responseText )
					else
						response = this.responseText
					
					self.options.then.call( this, response )

				} else {
					self.options.catch.call( this )
				}

			}
		}

		this.transport.withCredentials = this.options.withCredentials

		this.transport.open( this.options.method, url, this.options.async )

		this.transport.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' )

		if ( this.options.method == 'POST' ) {
			this.transport.setRequestHeader( 'Content-Type', this.options.contentType )

			Lea.parse( this.options.data, (key, val) => {
				if (self.parameters.length) self.parameters += '&'
				self.parameters += encodeURIComponent(key) + '=' + encodeURIComponent(val)
			} )
		}

		if ( this.options.send ) this.send()
	}

	always (cb) {
		this.options.always = cb
		return this
	}

	change (cb) {
		this.options.change = cb
		return this
	}

	then (cb) {
		this.options.then = cb
		return this
	}

	catch (cb) {
		this.options.catch = cb
		return this
	}

	send () {
		this.transport.send( this.parameters.length ? this.parameters : null );
		return this
	}

	abort () {
		this.transport.abort()
		return this
	}

}

Lea.ajax = (url, options) => {
	return new HttpRequest( url, options )
}

Lea.get = (url, options) => {
	return Lea.ajax( url, Lea.extend( options || {}, {method: 'GET'} ) )
}

Lea.post = (url, data, options) => {
	return Lea.ajax( url, Lea.extend( options || {}, {method: 'POST', data: data || {}} ) )
}

module.exports = Lea