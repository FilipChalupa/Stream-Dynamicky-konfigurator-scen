const express = require('express')
const serverless = require('serverless-http')

exports.handler = function (event, context, callback) {
	callback(null, {
		statusCode: 200,
		body: 'Hello, World',
	})
}
