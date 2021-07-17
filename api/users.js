import express from 'express'

const router = express.Router()

router.post('/')

router.get('/')

router.put('/:userId', (req, res) => {
	const { userId } = req.params
})

router.delete('/:userId', (req, res) => {
	const { userId } = req.params
})

export default router