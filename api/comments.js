const router = express.router()

// 관람평 불러올 때 최신순 정렬
router.get('/test/create', async (req, res) => {
  const comments = await Comment.find().sort({ createdAt: 'desc' })
  res.send({ comments: comments })
})

// 관람평 불러올 때 공감순 정렬
router.get('/test/like', async (req, res) => {
    const comments =await Comment.find().sort({ likedUsers.length: 'desc' })
    res.send({ comments: comments })
})

// 관람평 작성 누를 때 (1. 평점(Comment.star) 클릭, 2. 댓글 작성 3. 버튼 클릭 1,2번 순서 바뀔 수 있으나 3번은 고정)
// 유저 이름 locals에서 찾기(여기서는 어떻게 했는지 모르겠는데 인증된 정보를 통해 userSchema에서 찾으면될듯?)
router.post('/test', authMiddleware, async (req, res) => {
    const { comment, star } = req.body
   // const user = res.locals.user.name 
   if (comment.length === 0) {
    res.status(400).send({errorMessage: '관람평을 입력해주세요.',})
    return
   }
   const comment = new Comment({
       comment: comment,
       star: star,
       name: user
   })
   await comment.save()
})

export default router


