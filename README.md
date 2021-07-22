<h1 style="text-align: center">롯데시네마 클론 백엔드</h1>

## Project Overview
___

## Why Lotte Cinema?
다양한 서비스를 제공하는 롯데시네마를 클론 코딩 함으로써 API 작성과 협업 경험에 큰 도움이 될 것이라고 판단하였습니다.

## Table of Contents
___

## API
![Lotte Clone APIs](https://user-images.githubusercontent.com/78771384/126594086-1d0f5667-d406-42cc-8fe1-861939bbe9e9.png)

## Sample Codes
/api/movies/moviId
```javascript
router.get('/:movieId', async (req, res, next) => {
    const {movieId} = req.params;
    try{
    const movieDetails = await Movie.findById(movieId).populate('ratings.user').populate('likedUsers')
    res.status(200).json({ response: movieDetails})
    } catch (e) {
        console.error(e)
        res.status(400).send({ response:'Failed to get data' })
    }
});
```
## Dependency
bcrypt(5.0.1)  
cors(2.8.5)  
dotenv(10.0.0)  
express(4.17.1)  
jsonwebtoken(8.5.1)  
mongoose(5.13.3)  
nodemailer(6.6.3)  
pm2(5.1.0)  
puppeteer(10.1.0)  

## Developers
___
