export default {
	get (key) {
		if (!key) return null
		
		return decodeURIComponent( document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1') ) || null
	},

	set (key, value, vEnd, sPath, sDomain, bSecure) {
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

	remove (key, sPath, sDomain) {
		if ( !this.exists(key) ) return false
		
		document.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + ( sDomain ? '; domain=' + sDomain : '' ) + ( sPath ? '; path=' + sPath : '' )
		
		return true
	},

	exists (key) {
		if (!key) return false

		return ( new RegExp( '(?:^|;\\s*)' + encodeURIComponent(key).replace( /[\-\.\+\*]/g, '\\$&' ) + '\\s*\\=' ) ).test( document.cookie )
	},

	keys () {
		let aKeys = document.cookie.replace( /((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '' ).split( /\s*(?:\=[^;]*)?;\s*/ )

		for ( let nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++ ) {
			aKeys[nIdx] = decodeURIComponent(aKeys[nIdx])
		}

		return aKeys
	}
}