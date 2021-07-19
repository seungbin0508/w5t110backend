import express from 'express'
import Comment from '../models/comment.js'
import auth from '../middlewares/auth.js'

const router = express.Router()

// 관람평 작성 누를 때 (1. 평점(Comment.star) 클릭, 2. 댓글 작성 3. 버튼 클릭 1,2번 순서 바뀔 수 있으나 3번은 고정)
// 유저 이름 locals에서 찾기(여기서는 어떻게 했는지 모르겠는데 인증된 정보를 통해 userSchema에서 찾으면될듯? 변경될수도)
router.post('/', auth, async (req, res) => {
  
  const user = res.locals.user._id
  // const comment = new Comment({
  //   comment: req.body.comment,
  //   star: req.body.star,
  //   userId: user,
  // })
  try {
    Movie.findOneAndUpdate(
      {title:'블랙위도우'},
      {$push:
        {comments:
          {
      comment: req.body.comment,
      star: req.body.star,
      userId: user,
    }
  }
  })
    // await comment.save()
    res.status(200).send()
  } catch (err) {
    console.error(err)
    res.status(400).json(err)
  }
})

// Todo 아직 미완 body에서 받아올 것과 param에서 받아올 것 
router.put('/:commentId', auth, async (req, res) => {
  const { commentId } = req.params
  const { comment, star } = req.body
  try {
    await Comment.findByIdAndUpdate(commentId, { $set: { star, comment } }) // Todo문법 확인 필요
    res.status(200).send()
  } catch (err) {
    console.error(err)
    res.status(400).json(err)
  }
})

// Todo 아직 미완 body에서 받아올 것과 param에서 받아올 것 
router.delete('/:commentId', auth, async (req, res) => {
  const { commentId } = req.params
  try {
    await Comment.findByIdAndDelete(commentId)
    res.status(200).send()
  } catch (err) {
    console.error(err)
    res.status(400).json(err)
  }
})

export default router
