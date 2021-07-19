import express from 'express'
import { Comment } from '../models/index.js'

const router = express.Router()

// 관람평 작성 누를 때 (1. 평점(Comment.star) 클릭, 2. 댓글 작성 3. 버튼 클릭 1,2번 순서 바뀔 수 있으나 3번은 고정)
// 유저 이름 locals에서 찾기(여기서는 어떻게 했는지 모르겠는데 인증된 정보를 통해 userSchema에서 찾으면될듯? 변경될수도)
router.post('/test', authMiddleware, async (req, res) => {
  const user = res.locals.user.name
  const comment = new Comment({
    comment: req.body.comment,
    star: req.body.star,
    name: user,
  })
  await comment.create({comment, star, res.locals.user._id})
})

export default router
