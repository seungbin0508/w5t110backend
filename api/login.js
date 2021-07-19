import express from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const router = express.Router()

router.post('/', async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email })

		if (!(user && user.comparePassword(password))) {
			return res.status(400).json({
				errorMessage: '잘못된 이메일 혹은 비밀번호입니다.'
			})
		}

		if (!user.email_verified) {
			return res.status(400).json({
				errorMessage: '이메일 인증이 완료되지 않은 사용자입니다.'
			})
		}

		const payload = { userId: user._id, name: user.name }
		const options = { expiresIn: '1h'}
		const token = jwt.sign(payload, process.env.JWT_SECRET, options)

		return res.status(201).send({token})
	} catch (err) {
		console.error(err)
		res.status(401).json(err)
	}
})

export default router