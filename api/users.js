import express from 'express'

const router = express.Router()

router.post('/', async (req, res) => {
	try {
		// await User.create(req.body)
		res.sendStatus(201)
	} catch (err) {
		console.log(err)
		res.status(400).json({ err })
	}
})

router.get('/')

router.put('/:userId', (req, res) => {
	const { userId } = req.params
})

router.delete('/:userId', (req, res) => {
	const { userId } = req.params
})

export default router