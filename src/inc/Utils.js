import lea from '../lea'


export default {

	parse (obj, fn, context) {
		Object.keys(obj).forEach( key => {
			fn.call( context || obj, key, obj[key] )
		})
	},

	extend (obj) {
		if ( !obj ) obj = {}

		for ( var i = 1; i < arguments.length; i++ ) {
			if (!arguments[i]) continue

			lea.parse( arguments[i], (key, val) => obj[key] = val )
		}

		return obj
	},

	type (obj) {
		return Array.isArray(obj) ? 'array' : obj instanceof HTMLElement ? 'node' : typeof obj
	},

	ready (fn) {
		if ( document.readyState !== 'loading' )
			fn()
		else
			document.addEventListener( 'DOMContentLoaded', fn )
	},

	str2Node (str) {
		if (!str) return []
		if (lea.type == 'node') return str

		let
			regSingleTag  = /^<([a-z][^\/\0>: \x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?: <\/\1>|)$/i
			, isSingleTag = regSingleTag.exec(str)
			, nodes

		if (isSingleTag) {
			let div = document.createElement('div')
			div.innerHTML = str
			nodes = div.children
		} else {
			let doc = new DOMParser().parseFromString(str, 'text/html')
			nodes = doc.body.children
		}

		return Array.from(nodes)
	},

	debounce (fn, delay) {
		let timer
		
		return function () {
			var
				args      = arguments
				, context = this
		
			clearTimeout(timer)
			
			timer = setTimeout( () => fn.apply( context, args ), delay )
		}
	},

	throttle (fn, delay) {
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
	},

	slugify (str) {
		str = str.replace(/^\s+|\s+$/g, '').toLowerCase()

		let
			from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
			, to = 'aaaaeeeeiiiioooouuuunc------'

		for ( var i = 0, l = from.length; i < l; i++ )
			str = str.replace( new RegExp( from.charAt(i), 'g' ), to.charAt(i) )

		str = str.replace(/\./g, '-')
				.replace( /[^a-z0-9 -]/g, '' )
				.replace(/\s+/g, '-')
				.replace(/-+/g, '-')

		return str
	},

	camelcase (str) {
		return lea.lcFirst( lea.slugify(str).replace( /(?:^|\-)(\w)/g, (_, c) => c ? c.toUpperCase() : '' ) )
	},

	kebabcase (str) {
		return lea.slugify(str).replace( /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, match => '-' + match.toLowerCase() )
	},

	ucFirst (str) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	},

	lcFirst (str) {
		return str.charAt(0).toLowerCase() + str.slice(1)
	},

	rgb2Hex (rgb) {
		rgb = rgb.match( /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i )
		
		return ( rgb && rgb.length == 4 ) ? '#' +
			('0' + parseInt( rgb[1], 10 ).toString(16) ).slice(-2) +
			('0' + parseInt( rgb[2], 10 ).toString(16) ).slice(-2) +
			('0' + parseInt( rgb[3], 10 ).toString(16) ).slice(-2) : ''
	},

	lpad (str, size, chr = ' ') {
		str = str + ''
		return str.length >= size ? str : new Array( size - str.length + 1 ).join(chr) + str
	},

	rpad (str, size, chr = ' ') {
		str = str + ''
		return str.length >= size ? str : str + new Array( size - str.length + 1 ).join(chr)
	},

	prefix (prop) {
		let
			styles     = document.body ? document.body.style : document.createElement('div').style
			, prefixes = ['moz','Moz','webkit','Webkit','ms','o']
			, output   = this.camelcase(prop)
		
		if ( output in styles ) return output

		prop = this.ucFirst( output )

		prefixes.some( prefix => {
			if ( prefix + prop in styles ) {
				output = prefix + prop
				return true
			}
			return false
		})

		return output
	}
}
