import express from 'express';
import { Movie } from '../models/index.js';

const router = express.Router();


router.get('/', (req, res, next) => {
    const [
        _id,
        title,
        trailers,
        photos,
        bookRates,
        rates,
        likedUsers
        // 메인화면에서 필요한 정보: 영화 _id, 영화제목, 트레일러 각 1, 사진 각 1, 예매율, 좋아요한 유져목록,평점
    ] = Movie.find().select('_id title trailers photos bookRate likedUsers ratings.rating rate').exec((e, values) => {
        if (e) return res.status(400).send({response:'Failed to get data'})
        return [
            values.map(value=>value._id),
            values.map(value=>value.title),
            values.map(value=>value.trailers[value.trailers.length-1]),
            values.map(value=>value.photos[value.photos.length-1]),
            values.map(value=>value.bookRate),
            values.map(value=>value.rate),
            values.map(value=>value.likedUsers)
        ]
    })
    res.status(200).json({ response : _id, title, trailers, photos, bookRates, rates, likedUsers })
});

// populate
router.get('/:movieId', (req, res, next) => {
    const {movieId} = req.params;
    try{
    const movieDetails = Movie.findById(movieId).populate('ratings.user').populate('likedUsers')
    res.status(200).json({ response: movieDetails})
    } catch (e) {
        res.status(400).send({ response:'Failed to get data' })
    }
});


