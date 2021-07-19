import express from 'express'
import { Comment } from '../models/index.js'
import auth from '../middlewares/auth'

const router = express.Router()

// 관람평 작성 누를 때 (1. 평점(Comment.star) 클릭, 2. 댓글 작성 3. 버튼 클릭 1,2번 순서 바뀔 수 있으나 3번은 고정)
// 유저 이름 locals에서 찾기(여기서는 어떻게 했는지 모르겠는데 인증된 정보를 통해 userSchema에서 찾으면될듯? 변경될수도)
router.post('/', auth, async (req, res) => {
  const user = res.locals.user.name
  const comment = new Comment({
    comment: req.body.comment,
    star: req.body.star,
    userId: user,
  })
  try {
    await comment.create({ comment, star, userId })
    res.send.status(200)
  } catch (err) {
    console.error(err)
    res.status(400).json(err)
  }
})

// Todo 아직 미완 body에서 받아올 것과 param에서 받아올 것 
router.put('/:id', auth, async (req, res) => {
  //const commentId,
  const { userId } = req.params
  try {
    await User.findByIdAndUpdate(userId, req.body)
    res.send.status(200)
  } catch (err) {
    console.error(err)
    res.status(400).json(err)
  }
})

// Todo 아직 미완 body에서 받아올 것과 param에서 받아올 것 
router.delete('/', auth, async (req, res) => {
  const { commnetId } = req.params
  try {
    await Comment.findByIdAndDelete(commentId)
    res.send.status(200)
  } catch (err) {
    console.error(err)
    res.status(400).json(err)
  }
})

export default router
