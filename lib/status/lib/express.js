'use strict';
const express = require('express');

const constant = require('./constant');

function configuration(request, response, next) {
	request.constant = constant;
	next();
}

function factory() {
	const router = express();
	router.disable('etag');
	router.disable('x-powered-by');
	router.use(configuration);
	return router;
}

module.exports = factory;
