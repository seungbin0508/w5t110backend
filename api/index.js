import express from 'express'
import usersRouter from './users.js'

const router = express.Router()

// router.use('/movies', moviesRouter)
// router.use('/cinemas', cinemasRouter)
router.use('/users', usersRouter)

router.all('/', (req, res, next) => {
	console.log('test')
	return next()
})

export default router