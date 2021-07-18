import express from 'express'
import { User } from '../models/index.js'
import auth from '../middlewares/auth.js'

const router = express.Router()

router.post('/', async (req, res) => {
	try {
		await User.create(req.body)
		res.sendStatus(201)
	} catch (err) {
		console.log(err)
		res.status(400).json(err)
	}
})

/** All methods but POST has to go through auth middleware **/
router.use(auth)

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