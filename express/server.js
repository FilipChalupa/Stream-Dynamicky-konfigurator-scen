const express = require('express')
const serverless = require('serverless-http')
const app = express()
const bodyParser = require('body-parser')
const { GoogleSpreadsheet } = require('google-spreadsheet')

const sheetId = process.env.SHEET_ID
const googleApiKey = process.env.GOOGLE_API_KEY

if (!sheetId) {
	throw new Error('SHEET_ID is missing.')
}
if (!googleApiKey) {
	throw new Error('GOOGLE_API_KEY is missing.')
}

const doc = new GoogleSpreadsheet(sheetId)

const firstRowIndex = 2
const lastRowIndex = 99
const dateColumnIndex = 1
const timeColumnIndex = 4
const titleColumnIndex = 5
const lecturerColumnIndex = 6
const monthNames = [
	'leden',
	'únor',
	'březen',
	'duben',
	'květen',
	'červen',
	'červenec',
	'srpen',
	'září',
	'říjen',
	'listopad',
	'prosinec',
]
const sceneBaseUrl =
	'https://czechitas-podklady-web.github.io/Konfigurator-slidu/slide.html'
const icons = [
	{
		pattern: /html.*css/i,
		url: 'https://avatars0.githubusercontent.com/u/69383743?s=400&v=4',
	},
	{
		pattern: /git/i,
		url: 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png',
	},
	{
		pattern: /javascript/i,
		url:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/768px-Unofficial_JavaScript_logo_2.svg.png',
	},
	{
		pattern: /react/i,
		url:
			'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K',
	},
]

const dateStringToObject = (date) => {
	const [day = '31', month = '12', year = '2020'] = date.split('.')
	return {
		day: parseInt(day),
		month: parseInt(month),
		year: parseInt(year),
	}
}

const dateObjectToNumber = (date) => {
	return date.year * 10000 + date.month * 100 + date.day
}

const router = express.Router()

app.use(bodyParser.json())
app.use('/.netlify/functions/server', router) // path must route to lambda
app.use('/', async (request, response) => {
	try {
		const targetDate = dateStringToObject(
			request.query.date ||
				(() => {
					const today = new Date()
					return `${today.getDate()}.${
						today.getMonth() + 1
					}.${today.getFullYear()}`
				})(),
		)

		const sceneName = request.query.scene || 'intro' // intro, break, outro

		doc.useApiKey(googleApiKey)
		await doc.loadInfo()
		const sheet = doc.sheetsByIndex[0]

		await sheet.loadCells(`B${firstRowIndex + 1}:G${lastRowIndex + 1}`)

		const targetRowIndex = (() => {
			for (let rowIndex = firstRowIndex; rowIndex <= lastRowIndex; rowIndex++) {
				const rowDate = dateStringToObject(
					sheet.getCell(rowIndex, dateColumnIndex).value,
				)
				if (dateObjectToNumber(rowDate) >= dateObjectToNumber(targetDate)) {
					return rowIndex
				}
			}
		})()
		const title = sheet.getCell(targetRowIndex, titleColumnIndex).value
		const time = sheet.getCell(targetRowIndex, timeColumnIndex).value
		const lecturer = sheet.getCell(targetRowIndex, lecturerColumnIndex).value
		const rawDate = dateStringToObject(
			sheet.getCell(targetRowIndex, dateColumnIndex).value,
		)
		const date = `${rawDate.day}. ${monthNames[rawDate.month - 1]} ${
			rawDate.year
		}`

		const items = [
			{
				name: 'title',
				value:
					sceneName === 'intro'
						? `DA WEB: ${title}`
						: sceneName === 'break'
						? 'Přestávka'
						: sceneName === 'outro'
						? 'Konec'
						: '',
			},
			...(sceneName === 'intro' || sceneName === 'outro'
				? [
						{
							name: 'meta1',
							value: lecturer,
						},
						{
							name: 'meta2',
							value: `${date} | ${time}`,
						},
						{
							name: 'meta3',
							value: 'Praha',
						},
				  ]
				: []),
			...(sceneName === 'intro'
				? [
						{
							name: 'icon',
							value: icons.find((item) => item.pattern.test(title))?.url || '',
						},
				  ]
				: []),
		]

		const sceneUrl = `${sceneBaseUrl}?${items
			.map((item) => `${item.name}=${encodeURIComponent(item.value)}`)
			.join('&')}`

		response.redirect(302, sceneUrl)
		response.end()
	} catch (error) {
		console.error(error)
		response.redirect(302, sceneBaseUrl)
	}
})

module.exports = app
module.exports.handler = serverless(app)
