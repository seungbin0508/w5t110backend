import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.set('port', process.env.PORT)

app.listen(app.get('port') || 3000, () => {
	console.log(`Server listening on port ${app.get('port')}`)
})