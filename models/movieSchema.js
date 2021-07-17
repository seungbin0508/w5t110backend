const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema({
  title: String,
  grade: String,
  comments: [commentSchema],
  bookRate: Number,
  genre: String,
  releaseDate: Date,
  runningTime: Number,
  director: {
    name: String,
    img: String,
  },
  actors: [
    {
      name: String,
      role: String,
      img: String,
    },
  ],
  specialCinemas: [String],
  viewers: Number,
  ratings: [
    {
      user: { type: Schema.Types.ObjectId, unique: true, ref: 'User' },
      rating: Number,
    },
  ],
  likedUsers: [
    {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'User',
    },
  ],
  synopsis: String,
  preference: {
    gender: Number,
    generation: { 10: Number, 20: Number, 30: Number, 40: Number },
  },
  trailers: [String],
  photos: [String],
});

module.exports = mongoose.model('Movie', movieSchema);

//   virtual(virtual은 쿼리 불가),methods,statics,lean(virtual에는 사용 불가능),pre,hook,
