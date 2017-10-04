import lea from '../lea'


export default class HttpRequest {

	constructor (options = {}) {
		let
			cb     = function(){}
			, self = this

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
		}, options)

		this.transport      = new XMLHttpRequest()
		this.options.method = this.options.method.toUpperCase()
		this.parameters     = ''

		this.transport.onreadystatechange = function () {
			self.options.onChange( self.transport )

			if (this.readyState == 4) {

				self.options.always( self.transport )
				
				if (this.status === 200) {
					let
						responseContentType = this.getResponseHeader('Content-Type')
						, response

					if ( responseContentType && responseContentType.indexOf('application/json') > -1 )
						response = JSON.parse( this.responseText )
					else
						response = this.responseText
					
					self.options.onComplete( response, self.transport )

				} else {
					self.options.onError( self.transport )
				}

			}
		}

		this.transport.withCredentials = this.options.withCredentials

		this.transport.open( this.options.method, this.options.url, this.options.async )

		if (this.options.sendRequestHeaders) {
			this.transport.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' )

			lea.parse( this.options.headers, (key, val) => {
				this.transport.setRequestHeader( key, val )
			})
			
			this.transport.setRequestHeader( 'Content-Type', this.options.contentType )
		}

		if ( Object.keys(this.options.data).length ) {
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
		this.options.onChange = cb
		return this
	}

	then (cb) {
		this.options.onComplete = cb
		return this
	}

	catch (cb) {
		this.options.onError = cb
		return this
	}

	send (obj = null) {
		this.transport.send( this.parameters.length ? this.parameters : obj )
		return this
	}

	abort () {
		this.transport.abort()
		return this
	}

}
