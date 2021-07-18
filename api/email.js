import nodemailer from 'nodemailer'

const smtpTransport = new nodemailer.createTransport({
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