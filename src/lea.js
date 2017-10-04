import Lea from './inc/Lea'


const lea = (query, context = document) => new Lea( query, context )

/* ==========================================================================
   Utils
   ========================================================================== */

import Utils from './inc/Utils'

Object.assign(lea, Utils)


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
	return lea.ajax( Object.assign(options, {method: 'GET', url} ) )
}

lea.post = (url, data = {}, options = {}) => {
	return lea.ajax( Object.assign( options, {method: 'POST', data, url} ) )
}

export default lea
