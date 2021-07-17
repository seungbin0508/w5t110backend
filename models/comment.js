const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  comment: String,
  name: String,
  like: Number,
  star: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})
module.exports = mongoose.model('Comment', commentSchema)
