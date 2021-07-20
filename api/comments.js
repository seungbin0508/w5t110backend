import express from 'express'
// import Comment from '../models/comment.js'
import auth from '../middlewares/auth.js'
import movie from '../models/movie.js'
import Movie from '../models/movie.js'

const router = express.Router()

router.post('/', auth, async (req, res) => {
  try {
   await Movie.findByIdAndUpdate(
      req.body.movieId,
      {$push:
        {comments:
          {
      comment: req.body.comment,
      star: req.body.star,
      userId: res.locals.user._id,
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
    await Movie.updateOne( 
      {_id: movieId, 'comments._id':commentId}, 
      {$set:{"comments.$.comment": comment }})
    res.status(200).send()
  } catch (err) {
    console.error(err)
    res.status(400).json(err)
  }
})

router.delete('/:commentId', auth, async (req, res) => {
  const { commentId } = req.params
  try {
    await Movie.findByIdAndUpdate(
      req.body.movieId,
      {$pull:{comments:{_id : commentId}}}
      )

    res.status(200).send()
  } catch (err) {
    console.error(err)
    res.status(400).json(err)
  }
})

export default router
