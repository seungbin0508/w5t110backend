import express from 'express'
import usersRouter from './users.js'
import loginRouter from './login.js'
import commentsRouter from './comments.js'
import verificationRouter from './verification.js'
import moviesRouter from './movies.js'

const router = express.Router()

router.use('/movies', moviesRouter)
// router.use('/cinemas', cinemasRouter)
router.use('/users', usersRouter)
router.use('/login', loginRouter)
router.use('/comments', commentsRouter)
router.use('/verification', verificationRouter)

router.all('/', (req, res, next) => {
	console.log('test')
	return next()
})

export default router