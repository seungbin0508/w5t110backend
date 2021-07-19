import mongoose from 'mongoose'
import User from './user.js'
import Comment from './comment.js'
import Movie from './movie.js'

const connect = () => {
	if (process.env.NODE_ENV !== 'production') {
		mongoose.set('debug', true)
	}
}

mongoose.connect(
	'mongodb://localhost:27017/admin',
	{
		dbName: 'lotte',
		user: 'sbk',
		pass: 'hangh@e99',
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	(err) => {
		if (err) console.error('몽고디비 연결 오류', err)
		else console.log('몽고디비 연결 성공')
	}
)

mongoose.connection.on('error', (err) => {
	console.error('몽고디비 연결 에러', err)
	connect()
})

connect()

export { User, Comment, Movie }
