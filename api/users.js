import express from 'express'
import { User } from '../models/index.js'
import auth from '../middlewares/auth.js'
import smtpTransport from '../services/email.js'

const router = express.Router()

router.post('/', async (req, res) => {
	const { email } = req.body
	try {
		const { _id: userId } = await User.create(req.body)

		const mailOptions = {
			from: process.env.MAIL_ID,
			to: email,
			subject: '롯데 시네마 회원가입 인증 메일',
			text: `인증코드: ${userId}`
		}

		await smtpTransport.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.error(err)
				return res.status(400).json({
					errorMessage: '회원 가입 인증 메일 발송을 실패했습니다.'
				})
			}
			console.log(info.envelope)
			console.log(info.messageId)
			return res.sendStatus(201)
		})
	} catch (err) {
		console.log(err)
		return res.status(400).json(err)
	}
})

/** All methods but POST has to go through auth middleware **/
router.all('/:userId', auth, (req, res, next) => {
	const { userId } = req.params

	// Ensure if the id in path and token are identical
	if (userId !== String(res.locals.user._id)) {
		return next(new Error('토큰의 아이디와 경로의 아이디가 다릅니다.'))
	}

	next()
})

router.get('/:userId', async (req, res) => {
	const { userId } = req.params
	try {

		// Remove unnecessary fields, i.e. password in this circumstances, for security issue.
		const user = await User.findById(userId).select('-password')
		res.send(user)
	} catch (err) {
		console.error(err)
		res.send(400)
	}
})

router.put('/:userId', async (req, res) => {
	const { userId } = req.params
	try {

		// Update everything that came in inside req.body
		await User.findByIdAndUpdate(userId, req.body)
		res.sendStatus(200)
	} catch (err) {
		console.error(err)
		res.status(400).json(err)
	}
})

router.delete('/:userId', async (req, res) => {
	const { userId } = req.params
	try {
		await User.findByIdAndDelete(userId)
		res.sendStatus(200)
	} catch (err) {
		console.error(err)
		res.status(400).json(err)
	}
})

export default router