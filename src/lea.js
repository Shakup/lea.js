import Lea from './inc/Lea'

var lea = function (query, context) {
   return new Lea( query, context || document )
}

/* ==========================================================================
   Utils
   ========================================================================== */

import Utils from './inc/Utils'

Object.keys(Utils).forEach( key => lea[key] = Utils[key] )


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

export default lea
