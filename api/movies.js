import express from 'express';
import Movie from '../models/movie.js';
import User from '../models/user.js'
const router = express.Router();


router.get('/', (req, res, next) => {
    const [
        trailers,
        photos,
        bookRates,
        rates,
        likedUsers
    ] = Movie.find().select('-_id trailers photos bookRate ratings.rating likedUsers rate').exec((e, values) => {
        if (e) return res.status(400).send({response:'Failed to get data'})
        return [
            values.map(value=>value.trailers[value.trailers.length-1]),
            values.map(value=>value.photos[value.photos.length-1]),
            values.map(value=>value.bookRate),
            values.map(value=>value.rate),
            values.map(value=>value.likedUsers)
        ]
    })
    res.status(200).json({ response : trailers, photos, bookRates, rates, likedUsers })
});

// populate
router.get('/:movieId', (req, res, next) => {
    const {movieId} = req.params;
    try{
    const movieDetails = Movie.findByID(movieId).populate('ratings.user').populate('likedUsers')
    res.status(200).json({ response: movieDetails})
    } catch (e) {
        res.status(400).send({ response:'Failed to get data' })
    }
});


