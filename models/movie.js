import mongoose from 'mongoose';
import commentSchema from './comment.js'
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
},
{
  toObject:{ virtuals: true}, 
  toJson:{ virtuals: true}
});

movieSchema.static('replaceAllDocuments', async function (docs) {
  try {
    await mongoose.connection.dropCollection('movies');
    await this.insertMany(docs, { ordered: false });
  } catch {
    await this.insertMany(docs, { ordered: false });
  }
});

movieSchema.virtual('rate').get(function() {
  return !(this.ratings.length )? 0 : 
    Number(((this.ratings.reduce((acc, curr) => {
      return acc + curr.rating
    },0))/this.ratings.length).toFixed(1))
})

export default mongoose.model('Movie', movieSchema);
