import express from 'express'
import jwt from 'jsonwebtoken'

const router = expressRouter()

router.post('/', (req, res) => {
	try {
		// const { email, password } = req.body
		// const user = User.find({email})
		// if(user?.comparePassword()) {
		// const payload = { userId: user._id, name: user.name}
		// const options = { expiresIn: '5m' }
		// const token = jwt.sign(payload, process.env.JWT_SECRET, options)
		// return res.send({ token }) }
	} catch (err) {
		console.error(err)
		res.status(401).json(err)
	}
})

export default router