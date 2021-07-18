import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const smtpTransport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.MAIL_ID,
		pass: process.env.MAIL_PASSWORD
	},
	tls: {
		rejectUnauthorized: false
	}
})

export default smtpTransport