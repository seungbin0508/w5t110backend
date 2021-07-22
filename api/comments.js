import express from 'express'
import auth from '../middlewares/auth.js'
import Movie from '../models/movie.js'

const router = express.Router()

router.post('/:commentId/like', auth, async (req, res) => {
  const userId = res.locals.user._id
  const { movieId } = req.body
  const { commentId } = req.params
  const find = await Movie.findById(movieId)
  const comment = await find.comments.filter(function (comment) {
    return comment._id == commentId
  })
  try {
    if (req.body.movieId.length === 0) {
      res.status(400).json({ errorMessage: '해당 영화를 찾을 수 없습니다.' })
      return
    }
    if (!comment[0].likedUsers.includes(userId)) {
      await Movie.updateOne(
        { _id: movieId, 'comments._id': commentId },
        { $push: { 'comments.$.likedUsers': userId } }
      )
      const find = await Movie.findById(movieId)
      const likedUsersLength = find.comments.filter(function (comment) {
        return comment._id == commentId
      })[0].likedUsers.length
      console.log(likedUsersLength)
      res.status(200).json({ likedUsersLength })
      return
    }
    if (comment[0].likedUsers.includes(userId)) {
      await Movie.updateOne(
        { _id: movieId, 'comments._id': commentId },
        { $pull: { 'comments.$.likedUsers': userId } }
      )
      const find = await Movie.findById(movieId)
      const likedUsersLength = find.comments.filter(function (comment) {
        return comment._id == commentId
      })[0].likedUsers.length
      console.log(likedUsersLength)
      res.status(200).json({ likedUsersLength })
      return
    }
  } catch (err) {
    console.error(err)
    res.status(400).json(err)
  }
})

router.get('/:commentId', auth, async (req, res) => {
  const { commentId } = req.params
  const { movieId } = req.body
  try {
  const find = await Movie.findById(movieId)
  const comment = find.comments.filter(function (comment) { return comment._id == commentId })
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
  return comment.userId == res.locals.user.id })
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
          userName : res.locals.user.name,
          comment: req.body.comment,
          star: req.body.star,
          userId: res.locals.user._id,
        },
      },
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
      $pull: { comments: { _id: commentId } },
    })
    res.status(200).send()
  } catch (err) {
    console.error(err)
    res.status(400).json(err)
  }
})

export default router
