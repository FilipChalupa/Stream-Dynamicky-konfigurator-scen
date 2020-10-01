const express = require('express')
console.log(express)

exports.handler = function (event, context, callback) {
	callback(null, {
		statusCode: 200,
		body: 'Hello, World',
	})
}
