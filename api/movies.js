import express from 'express';
import { Movie } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
    const movies = await Movie.find().select('title trailers photos bookRate likedUsers ratings.rating rate')
        // 메인화면에서 필요한 정보: 영화 _id, 영화제목, 트레일러 각 1, 사진 각 1, 예매율, 좋아요한 유져목록,평점
    const [_id, title, trailers, photos, bookRate, rate, likedUsers]= [
        movies.map(value=>value._id),
        movies.map(value=>value.title),
        movies.map(value=>value.trailers?.[value.trailers.length-1]),
        movies.map(value=>value.photos[value.photos.length-1]),
        movies.map(value=>value.bookRate),
        movies.map(value=>value.rate),
        movies.map(value=>value.likedUsers)
        ]
        res.status(200).json({ result:_id, title, trailers, photos, bookRate, rate, likedUsers })
    })
    


// populate
router.get('/:movieId', async(req, res, next) => {
    const {movieId} = req.params;
    try{
    const movieDetails = await Movie.findById(movieId).populate('ratings.user').populate('likedUsers')
    res.status(200).json({ response: movieDetails})
    } catch (e) {
        res.status(400).send({ response:'Failed to get data' })
    }
});

export default router