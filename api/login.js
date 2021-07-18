import express from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const router = express.Router()

router.post('/', async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await User.find({email})
		if(user?.comparePassword(password)) {
		const payload = { userId: user._id, name: user.name}
		const options = { expiresIn: '1h' }
		const token = jwt.sign(payload, process.env.JWT_SECRET, options)
		return res.send({ token }) }
	} catch (err) {
		console.error(err)
		res.status(401).json(err)
	}
})

export default router