import lea from '../lea'


export default class HttpRequest {

	constructor (url, options) {
		let
			cb     = function(){}
			, self = this

		this.options = lea.extend({
			method: 'GET',
			always: cb,
			then: cb,
			catch: cb,
			change: cb,
			send: true,
			async: true,
			data: {},
			headers: {},
			withCredentials: false,
			contentType: 'application/x-www-form-urlencoded'
		}, options || {})

		this.transport      = new XMLHttpRequest()
		this.options.method = this.options.method.toUpperCase()
		this.parameters     = ''

		this.transport.onreadystatechange = function () {

			self.options.change.call( this )

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

		lea.parse( this.options.headers, (key, val) => {
			this.transport.setRequestHeader( key, val )
		})

		if ( this.options.method == 'POST' ) {
			this.transport.setRequestHeader( 'Content-Type', this.options.contentType )

			lea.parse( this.options.data, (key, val) => {
				if (this.parameters.length) this.parameters += '&'
				this.parameters += encodeURIComponent(key) + '=' + encodeURIComponent(val)
			} )
		}

		if ( this.options.send ) this.send()

		return this
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
		this.transport.send( this.parameters.length ? this.parameters : null )
		return this
	}

	abort () {
		this.transport.abort()
		return this
	}

}
