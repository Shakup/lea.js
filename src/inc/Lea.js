import lea from '../lea'


export default class Lea {

	constructor (query, context) {
		if ( lea.type(query) != 'array' ) query = [query]

		this.elements = query.map( (obj) => {

			if ( lea.type(obj) == 'node' || obj === window || obj === document ) {
				return obj
			} else if ( lea.type(obj) === 'string' ) {
				return Array.from( context.querySelectorAll(obj) )
			} else return null
			
		})

		this.elements = ( [].concat.apply( [], this.elements ) ).filter(Boolean)
		this.length   = this.elements.length

		return this
	}

	each (action) {
		let response, BreakException = function(){}

		try {
			this.elements.forEach( (element, index) => {
				response = action.call( element, element, index )
				if (response === false)  throw BreakException
			})
		} catch(e) {
			if (e !== BreakException) throw e
		}

		return this
	}

	get (index = null) {
		return index !== undefined ? this.elements[ index ] : this.elements
	}

	addClass (...classes) {
		classes.forEach( klass => {
			this.each( element => element.classList.add(klass) )
		})
		return this
	}

	removeClass (...classes) {
		classes.forEach( klass => {
			this.each( element => element.classList.remove(klass) )
		})
		return this
	}

	hasClass (klass) {
		let bool = true

		this.elements.forEach( (element) => {
			if ( !element.classList.contains(klass) ) {
				bool = false
				return false
			}
		})

		return bool
	}

	toggleClass (klass) {
		this.each( element => element.classList.toggle(klass) )
		return this
	}

	show (display) {
		if ( !display ) display = 'block'

		this.each( element => element.style.display = display )

		return this
	}

	hide () {
		this.each( element => element.style.display = 'none' )
		return this
	}

	toggle (display) {
		if ( !display ) display = 'block'

		this.each( element => {
			let element_display = lea(element).style('display')
			element.style.display = element_display == 'none' ? display : 'none'
		})

		return this
	}

	html (src) {
		if ( !src ) {
			return this.get(0).innerHTML
		} else {
			this.each( element => element.innerHTML = src )
			return this
		}
	}

	on (events, fn) {
		let tabevts = events.split(' ')

		this.each( element => {
			tabevts.forEach( (event) => element.addEventListener(event, fn, false) )
		} )

		return this
	}

	off (events, fn) {
		let tabevts = events.split(' ')

		this.each( element => {
			tabevts.forEach( (event) => element.removeEventListener(event, fn, false) )
		})

		return this
	}

	delegate (selector, events, fn) {
		let tabevts = events.split(' ')

		this.each( element => {
			tabevts.forEach( (event) => {
				element.addEventListener(event, (evt) => {
					if ( lea( evt.target ).is(selector) ) fn.call( evt.target, event )
				}, false )
			})
		})

		return this
	}

	trigger (event) {
		var evt = document.createEvent('HTMLEvents')
		
		evt.initEvent(event, true, true)

		this.each( element => element.dispatchEvent(evt) )

		return this
	}

	click (fn) {
		return this.on('click', fn)
	}

	focus () {
		this.elements[0].focus()
		return this
	}

	select () {
		let element = this.elements[0]

		if ('setSelectionRange' in element) {
			if (!lea(element).is(':focus')) {
				element.focus()
			}
			element.setSelectionRange(0, element.value.length)
		}

		return this
	}

	attr (attr, val) {
		if ( val !== undefined ) {
			this.each( element => element.setAttribute( attr, val ) )
			return this
		} else {
			return this.elements[0].getAttribute(attr)
		}
	}

	removeAttr (attr) {
		this.each( element => element.removeAttribute(attr) )
		return this
	}

	data (data, value) {
		if (value !== undefined) {
			this.each( element => element.dataset[data] = value )
			return this
		} else {
			return this.get(0).dataset[data]
		}
	}

	removeData (data) {
		this.each( () => delete this.dataset[data] )
		return this
	}

	append (obj) {
		this.each( element => {

			if ( lea.type(obj) == 'node' ) {
				element.appendChild(obj)
			} else {
				let nodes = lea.str2Node(obj)
				nodes.forEach( (node) => element.appendChild(node) )
			}

		})

		return this
	}

	prepend (obj) {
		this.each( element => {

			if ( lea.type(obj) == 'node' ) {
				element.insertBefore( obj, element.firstChild )
			} else {
				let nodes = lea.str2Node(obj)
				nodes.forEach( (node) => element.insertBefore( node, element.firstChild) )
			}

		})

		return this
	}

	before (obj) {
		this.each( element => element.insertAdjacentHTML( 'beforebegin', obj ) )
		return this
	}

	after (obj) {
		this.each( element => element.insertAdjacentHTML( 'afterend', obj ) )
		return this
	}

	remove () {
		this.each( element => element.parentNode.removeChild(element) )
		return this
	}

	parent (tag) {
		let parents = []

		this.each( element => {
			let parent = element.parentNode

			if (parent) {
				if (tag !== undefined) {
					while (parent && parent.tagName.toLowerCase() != tag.toLowerCase()) {
						parent = parent.parentNode
					}
				}
				parents.push(parent)
			}
		})
		
		return lea(parents)
	}

	find (selector) {
		let found = []

		this.each( element => {
			found = found.concat( Array.from( element.querySelectorAll(selector) ) )
		})

		return lea(found)
	}

	prev () {
		let previous = []

		this.each( element => {
			let prev = element.previousElementSibling
			if (prev) previous.push(prev)
		})

		return lea(previous)
	}

	next () {
		let next = []

		this.each( element => {
			let nex = element.nextElementSibling
			if (nex) next.push(nex)
		})

		return lea(next)
	}

	clear () {
		this.each( element => element.innerHTML = '' )
		return this
	}

	is (selector) {
		let
			flag      = true
			, matches = element => {
				return ( element.matches || element.matchesSelector || element.msMatchesSelector || element.webkitMatchesSelector ).call( element, selector )
			}

		this.each( element => {
			if ( !matches(element) ) {
				flag = false
				return false
			}
		})

		return flag
	}

	offset () {
		if ( !this.length ) return {top:0, left:0}

		let
			element = this.elements[0],
			rect    = element.getBoundingClientRect()

		return {
			top: rect.top + document.body.scrollTop,
			left: rect.left + document.body.scrollLeft
		}
	}

	position () {
		if ( !this.length ) return {top:0, left:0}

		let rect = this.elements[0].getBoundingClientRect()

		return {
			top: rect.top,
			left: rect.left
		}
	}

	replaceWith (html) {
		this.each( element => element.outerHTML = html )
		return this
	}

	serialize () {
		let
			form     = this.elements[0]
			, serial = {}
			, l, j

		if ( form.nodeName.toLowerCase() !== 'form' ) return serial

		Array.from( form.elements ).forEach( (field, i) => {

			if ( field.name && ( ['file', 'button', 'reset', 'submit'] ).indexOf( field.type ) == -1 ) {
				if ( field.type == 'select-multiple' ) {
					l = form.elements[i].options.length
					
					for ( j = 0; j < l; j++ ) {
						if ( field.options[j].selected ) {
							serial[field.name] = field.options[j].value
						}
					}
					
				} else if ( ( field.type != 'checkbox' && field.type != 'radio' ) || field.checked ) {
					serial[field.name] = field.value
				}
			}

		})

		return serial
	}

	submit (options = {}) {
		let form = this.elements[0]

		if ( form.nodeName.toLowerCase() !== 'form' ) return false

		options = lea.extend({
			method: form.method || 'GET',
			data: lea(form).serialize()
		}, options)

		return lea.ajax( form.action || '#', options )
	}

	val (value = null) {
		if ( !value ) {
			return this.get(0).value || ''
		} else {
			this.each( element => element.value = value )
			return this
		}
	}

	style (props, value) {

		function compute (val) {
			if ( !val ) return ''

			if ( val.match( /^rgba\(0\,\s?0\,\s?0\,\s?0\)$/g ) ) {
				return 'transparent'
			}

			let hex = lea.rgb2Hex(val)
			
			if ( hex ) {
				return hex
			} else return val
		}

		let propsType = lea.type(props)

		if ( 'string' == propsType && !value ) {
			return compute( window.getComputedStyle( this.get(0) )[ lea.prefix(props) ] )
		}

		if ( 'string' == propsType && 'string' == lea.type(value) ) {
			this.each( element => element.style[ lea.prefix(props) ] = value )
		}

		if ( 'object' == propsType && !value ) {
			let prefixed_props = {}

			Object.keys(props).forEach( prop => prefixed_props[ lea.prefix(prop) ] = props[prop] )

			this.each( element => {
				Object.keys(prefixed_props).forEach( prop => element.style[prop] = prefixed_props[prop] )
			})
		}

		return this
	}
}