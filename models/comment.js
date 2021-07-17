const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  comment: String,
  name: String,
  likedUsers: [
    {
      user: mongoose.Schema.ObjectId, // Todo 수정 예정
      ref: 'User',
    },
  ],
  star: Number,
  createdAt: {
    type: Date,
    default: Date.now,
    // defalt: Date.now.toLocaleDateString(),
  },
})
export default mongoose.model('Comment', commentSchema)
