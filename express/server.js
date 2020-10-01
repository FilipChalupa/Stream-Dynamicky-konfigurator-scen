const express = require('express')
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const app = express()

exports.handler = function (event, context, callback) {
	callback(null, {
		statusCode: 200,
		body: 'Hello, World',
	})
}
