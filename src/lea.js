import Lea from './inc/Lea'


var lea = (query, context = document) => new Lea( query, context )

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
   Mobile Detection
   ========================================================================== */

import Device from './inc/Device'

lea.device = Device
lea.isMobile = () => !lea.device('desktop')


/* ==========================================================================
   Asynchronous Https Requests
   ========================================================================== */

import HttpRequest from './inc/HttpRequest'

lea.ajax = options => {
	return new HttpRequest(options)
}

lea.get = (url, options = {}) => {
	return lea.ajax(lea.extend(options, {method: 'GET', url} ) )
}

lea.post = (url, data = {}, options = {}) => {
	return lea.ajax( lea.extend( options, {method: 'POST', data, url} ) )
}

export default lea
