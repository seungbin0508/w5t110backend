import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  likedUsers: [
    {
      type: mongoose.Schema.ObjectId, // Todo 수정 예정
      ref: 'User',
    },
  ],
  star: { type: Number, min: 1, max: 10 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})
export default mongoose.model('Comment', commentSchema)
