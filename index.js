import express from 'express'
import dotenv from 'dotenv'
import './models/index.js'
import router from './api/index.js'

dotenv.config()

const app = express()

app.set('port', process.env.PORT)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(router)

app.listen(app.get('port') || 3000, () => {
	console.log(`Server listening on port ${app.get('port')}`)
})