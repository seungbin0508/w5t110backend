import express from 'express'
import auth from '../middlewares/auth.js'
import Movie from '../models/movie.js'

const router = express.Router()

router.post('/', auth, async (req, res) => {
  try {
    if (req.body.comment.length === 0) {
      res.status(400).send('코멘트를 입력해주세요!')
      return
    }
    if (req.body.star == 'undefined') {
      res.status(400).send('평점을 입력해주세요!')
      return
    }
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
    if (req.body.comment.length === 0) {
      res.status(400).send('코멘트를 입력해주세요!')
      return
    }
    if (req.body.star.length === 0) {
      res.status(400).send('평점을 입력해주세요!')
      return
    }
    await Movie.updateMany( 
      {_id: movieId, 'comments._id':commentId}, 
      {$set:{"comments.$.comment": comment, "comments.$.star": star }}
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
    if ( req.body.movieId.length === 0 ) {
      res.status(400).send('해당 영화를 찾을 수 없습니다.!')
      return
    }
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
