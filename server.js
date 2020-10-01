const express = require('express')
const app = express()
const port = 3000

app.get('/', (request, response) => {
	const date =
		request.query.date ||
		(() => {
			const today = new Date()
			return `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`
		})()
	console.log('date:', date)
	response.send('Hello World!')
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
