import express from 'express'
import auth from '../middlewares/auth.js'
import Movie from '../models/movie.js'

const router = express.Router()

router.post('/:commentId/like', auth, async (req, res) => {
	const { _id: userId } = res.locals.user
	const { movieId } = req.body
	const { commentId } = req.params
	const movie = await Movie.findById(movieId)
	const comment = await movie.comments.id(commentId)
	const { likedUsers } = comment

	if (!movie) {
		return res.stats(404).json({
			errorMessage: 'Invalid movie ID.'
		})
	}

	try {
		likedUsers.id(userId) ? likedUsers.id(userId).remove() : likedUsers.push(userId)
		return res.status(201).json(likedUsers.length)
	} catch (e) {
		console.error(e)
		return res.status(400).json(e)
	}
})

router.get('/:commentId', auth, async (req, res) => {
	const { commentId } = req.params
	const { movieId } = req.body
	try {
		const find = await Movie.findById(movieId)
		const comment = find.comments.filter(
			function (comment) { return comment._id == commentId })
		console.log(comment)
		res.status(200).json({ comment })
	} catch (err) {
		console.error(err)
		res.status(400).json(err)
	}
})

router.post('/', auth, async (req, res) => {
	const find = await Movie.findById(req.body.movieId)
	const commentUser = await find.comments.filter(function (comment) {
		return comment.userId == res.locals.user.id
	})
	try {
		if (commentUser.length != 0) {
			res.status(400).json({ errorMessage: '이미 관람평을 등록한 사용자입니다.' })
			return
		}
		if (req.body.movieId.length === 0) {
			res.status(400).json({ errorMessage: '해당 영화를 찾을 수 없습니다.' })
			return
		}
		if (req.body.comment.length === 0) {
			res.status(400).json({ errorMessage: '관람평을 입력해 주세요!' })
			return
		}
		if (req.body.star.length === 0) {
			res.status(400).json({ errorMessage: '평점을 클릭해 주세요!' })
			return
		}
		await Movie.findByIdAndUpdate(req.body.movieId, {
			$push: {
				comments: {
					userName: res.locals.user.name,
					comment: req.body.comment,
					star: req.body.star,
					userId: res.locals.user._id
				}
			}
		})
		res.status(200).send()
	} catch (err) {
		console.error(err)
		res.status(400).json(err)
	}
})

router.put('/:commentId', auth, async (req, res) => {
	const { commentId } = req.params
	const { comment, star, movieId } = req.body
	try {
		if (req.body.movieId.length === 0) {
			res.status(400).json({ errorMessage: '해당 영화를 찾을 수 없습니다.' })
			return
		}
		if (req.body.comment.length === 0) {
			res.status(400).json({ errorMessage: '관람평을 입력해 주세요!' })
			return
		}
		if (req.body.star.length === 0) {
			res.status(400).json({ errorMessage: '평점을 클릭해 주세요!' })
			return
		}
		await Movie.updateMany(
			{ _id: movieId, 'comments._id': commentId },
			{ $set: { 'comments.$.comment': comment, 'comments.$.star': star } }
		)
		res.status(200).send()
	} catch (err) {
		console.error(err)
		res.status(400).json(err)
	}
})

router.delete('/:commentId', auth, async (req, res) => {
	const { commentId } = req.params
	try {
		if (req.body.movieId.length === 0) {
			res.status(400).json({ errorMessage: '해당 영화를 찾을 수 없습니다.' })
			return
		}
		await Movie.findByIdAndUpdate(req.body.movieId, {
			$pull: { comments: { _id: commentId } }
		})
		res.status(200).send()
	} catch (err) {
		console.error(err)
		res.status(400).json(err)
	}
})

export default router
