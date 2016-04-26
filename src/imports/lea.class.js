'use strict'

const Lea = require('../lea')

class LeaClass {

	constructor (query, context) {
		if ( Lea.type(query) != 'array' ) query = [query]

		this.elements = query.map( (obj) => {

			if ( Lea.type(obj) == 'node' || obj === window || obj === document ) {
				return obj
			} else if ( Lea.type(obj) === 'string' ) {
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

	get (index) {
		return index !== undefined ? this.elements[ index ] || null : this.elements;
	}

	addClass (klass) {
		this.each( (element) => element.classList.add(klass) )
		return this
	}

	removeClass (klass) {
		this.each( (element) => element.classList.remove(klass) )
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
		this.each( (element) => element.classList.toggle(klass) )
		return this
	}

	show (display) {
		if ( !display ) display = 'block'

		this.each( (element) => element.style.display = display )

		return this
	}

	hide () {
		this.each( (element) => element.style.display = 'none' )
		return this
	}

	toggle (display) {
		if ( !display ) display = 'block'

		this.each( (element) => element.style.display = element.style.display == 'none' ? display : 'none' )

		return this
	}

	html (src) {
		if ( !src ) {
			return this.get(0).innerHTML
		} else {
			this.each( (element) => element.innerHTML = src )
			return this
		}
	}

	on (events, fn) {
		let tabevts = events.split(' ')

		this.each( (element) => {
			tabevts.forEach( (event) => element.addEventListener(event, fn, false) )
		} )

		return this
	}

	off (events, fn) {
		let tabevts = events.split(' ')

		this.each( (element) => {
			tabevts.forEach( (event) => element.removeEventListener(event, fn, false) )
		})

		return this
	}

	delegate (selector, events, fn) {
		let tabevts = events.split(' ')

		this.each( (element) => {
			tabevts.forEach( (event) => {
				element.addEventListener(event, (evt) => {
					if ( Lea( evt.target ).is(selector) ) fn.call( evt.target, event )
				}, false )
			})
		})

		return this
	}

	trigger (event) {
		var evt = document.createEvent('HTMLEvents')
		
		evt.initEvent(event, true, true)

		this.each( (element) => element.dispatchEvent(evt) )

		return this
	}

	click (fn) {
		return this.on('click', fn)
	}

	attr (attr, val) {
		if ( val !== undefined ) {
			this.each( (element) => element.setAttribute( attr, val ) )
			return this
		} else {
			return this.elements[0].getAttribute(attr)
		}
	}

	removeAttr (attr) {
		this.each( (element) => element.removeAttribute(attr) )
		return this
	}

	data (data, value) {
		if (value !== undefined) {
			this.each( (element) => element.dataset[data] = value )
			return this
		} else {
			return this.get(0).dataset[data]
		}
	}

	removeData (data) {
		this.each( (element) => delete this.dataset[data] )
		return this
	}

	append (obj) {
		this.each( (element) => {

			if ( Lea.type(obj) == 'node' ) {
				element.appendChild(obj)
			} else {
				let nodes = Lea.str2Node(obj)
				nodes.forEach( (node) => element.appendChild(node) )
			}

		})

		return this
	}

	prepend (obj) {
		this.each( (element) => {

			if ( Lea.type(obj) == 'node' ) {
				element.insertBefore( obj, element.firstChild )
			} else {
				let nodes = Lea.str2Node(obj)
				nodes.forEach( (node) => element.insertBefore( node, element.firstChild) )
			}

		})

		return this
	}

	before (obj) {
		this.each( (element) => element.insertAdjacentHTML( 'beforebegin', obj ) )
		return this
	}

	after (obj) {
		this.each( (element) => element.insertAdjacentHTML( 'afterend', obj ) )
		return this
	}

	remove () {
		this.each( (element) => element.parentNode.removeChild(this) )
		return this
	}

	parent () {
		let parents = []

		this.each( (element) => {
			let parent = this.parentNode
			if (parent) parents.push(parent)
		})
		
		return Lea(parents)
	}

	find (selector) {
		let found = []

		this.each( (element) => {
			found = found.concat( Lea.toArray( element.querySelectorAll(selector) ) )
		})

		return Lea(found)
	}

	prev () {
		let previous = []

		this.each( (element) => {
			let prev = element.previousElementSibling
			if (prev) previous.push(prev)
		})

		return Lea(previous)
	}

	next () {
		let next = []

		this.each( (element) => {
			let nex = element.nextElementSibling
			if (nex) next.push(nex)
		})

		return Lea(next)
	}

	clear () {
		this.each( (element) => element.innerHTML = '' )
		return this
	}

	is (selector) {
		let
			flag      = true
			, matches = (element) => {
				return ( element.matches || element.matchesSelector || element.msMatchesSelector || element.webkitMatchesSelector ).call( element, selector )
			}

		this.each( (element) => {
			if ( !matches(this) ) {
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
		this.each( (element) => element.outerHTML = html )
		return this
	}

	serialize () {
		let
			form     = this.elements[0]
			, serial = {}
			, l, j

		if ( form.nodeName.toLowerCase() !== 'form' ) return serial

		Lea.toArray( form.elements ).forEach( (field) => {

			if ( field.name && ( ['file', 'button', 'reset', 'submit'] ).indexOf( field.type ) == -1 ) {
				if ( field.type == 'select-multiple' ) {
					l = form.elements[i].options.length;
					
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

	submit (options) {
		let form = this.elements[0]

		if ( form.nodeName.toLowerCase() !== 'form' ) return false

		options = Lea.extend({
			method: form.method || 'GET',
			data: Lea(form).serialize()
		}, options || {})

		return Lea.ajax( form.action || '#', options )
	}

}

module.exports = Lea